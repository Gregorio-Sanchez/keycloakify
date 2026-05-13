# Despliegue de Keycloak (keycloakext.hefame.es)

Keycloak 26.2.4 en alta disponibilidad (3 réplicas) sobre GKE Autopilot,
gestionado por ArgoCD, con base de datos en `postgresql.hefame.es`.

---

## Prerrequisitos

- VPN corporativa activa (el cluster es privado, solo accesible desde `172.30.0.0/16`)
- `gcloud` y `kubectl` instalados
- Acceso al repo `cd` en GitHub (`HefameMicroservices/cd`)
- Acceso a ArgoCD (`https://argocd2026.hefame.es`)

---

## Paso 1 — Conectarse al cluster

```powershell
gcloud container clusters get-credentials gke-prod-autopilot `
  --region europe-southwest1 `
  --project hfm-microservicios
```

---

## Paso 2 — Crear el schema en PostgreSQL

Ejecutar desde Cloud Shell con el contexto del cluster antiguo (tiene visibilidad de red a `postgresql.hefame.es`):

```bash
kubectl config use-context gke_microservices-hefame_europe-southwest1-b_hefame-production-cluster

kubectl run psql-tmp --rm -it --restart=Never \
  --image=postgres:16 \
  -n hefamejs \
  -- psql -h postgresql.hefame.es -U keycloak -d keycloak
```

```sql
CREATE SCHEMA IF NOT EXISTS keycloakext;
GRANT ALL ON SCHEMA keycloakext TO keycloak;
\q
```

---

## Paso 3 — Configurar los manifiestos en el repo cd

Los ficheros están en `argocd2026/keycloak/` del repo `cd`:

```
argocd2026/keycloak/
├── kustomization.yaml
├── base/
│   ├── 1_configmap.yaml         # Variables de entorno (DB, hostname, cache...)
│   ├── 2_rbac.yaml              # ServiceAccount + RBAC para descubrimiento entre pods
│   ├── 3_deployment.yaml        # 3 réplicas, imagen, recursos, probes
│   ├── 4_service.yaml           # Service 8080 + Service headless para JGroups
│   ├── 5_httproute.yaml         # Enrutamiento externo via Gateway API
│   └── 6_healthcheckpolicy.yaml # Health check del load balancer en puerto 9000
└── overlays/production/
    └── keycloak-secrets.yaml    # Contraseñas de BD y admin (no subir en claro a repos públicos)
```

Actualizar las contraseñas reales en `overlays/production/keycloak-secrets.yaml`:

```yaml
stringData:
  KC_DB_PASSWORD: "la_password_real"
  KEYCLOAK_ADMIN_PASSWORD: "la_password_real"
```

Hacer commit y push.

---

## Paso 4 — Crear la Application en ArgoCD

En `https://argocd2026.hefame.es` → **New App**:

| Campo | Valor |
|---|---|
| Application Name | `keycloackext` |
| Repository URL | `https://github.com/HefameMicroservices/cd.git` |
| Path | `argocd2026/keycloak` |
| Cluster | `https://kubernetes.default.svc` |
| Namespace | `infraestructura` |

Pulsar **Sync** (sin marcar REPLACE).

---

## Paso 5 — Configurar el DNS

Añadir registro A en ambos sistemas DNS:

| DNS | Registro |
|---|---|
| Active Directory (red interna / VPN) | `keycloakext.hefame.es` → `34.175.162.17` |
| Akamai (internet) | `keycloakext.hefame.es` → `34.175.162.17` |

---

## Verificación

```powershell
# Estado de los pods (deben estar 3/3 Running)
kubectl get pods -n infraestructura -l app=keycloak

# Logs de arranque (buscar "started in Xs" y los 3 nodos en el cluster)
kubectl logs -n infraestructura deployment/keycloak --tail=30
```

Panel de administración: `https://keycloakext.hefame.es/admin`

---

## Notas

**Versión**: Keycloak 26.2.5 tiene un bug en el admin console en Kubernetes
([issue #40113](https://github.com/keycloak/keycloak/issues/40113)). Se usa 26.2.4.

**Health check**: `/health/ready` solo existe en el puerto 9000 (management interface).
El puerto 8080 sirve la aplicación.

**Providers y themes**: Los volúmenes son `emptyDir` (no persistentes). Con 3 réplicas
y `ReadWriteOnce` no es posible compartir un PVC. Los providers/themes deben incluirse
en una imagen Docker personalizada si se necesitan.

**Cambios de configuración**: Siempre en el repo `cd`, commit + push, Sync en ArgoCD.
Nunca con `kubectl apply` directo.
