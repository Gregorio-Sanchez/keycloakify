import "./main.css";
import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";
import { tss } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import background from "./assets/keycloak-bg.png"

const UserProfileFormFields = lazy(
    () => import("keycloakify/login/UserProfileFormFields")
);

const Login = lazy(() => import("./pages/Login"));

const doMakeUserConfirmPassword = true;

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffcd00',
            light: '#fff0b2'
        },
        secondary: {
            main: '#3f51b5'
        },
        background: {
            default: '#eeeeee',
            //   paper: grey[300] // Fondo de los componentes Paper en el tema claro
        },

    },
    typography: {
        fontFamily: "Geist"
    }
    // palette: {
    //     mode: "dark",
    //     background: {
    //         default: "#000000",
    //         paper: "#111111"
    //     },
    //     text: {
    //         primary: "#EDEDED",
    //         secondary: "#B0B0B0"
    //     }
    // },
});

export default function KcPage(props: { kcContext: KcContext }) {
    return (
        <ThemeProvider theme={theme}>
            <KcPageContextualized {...props} />
        </ThemeProvider>
    );
}

function KcPageContextualized(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });
    const { classes } = useStyles();

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl":
                        return (
                            <Login
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const useStyles = tss.create(({ theme }) => ({
    kcHtmlClass: {
        ":root": {
            colorScheme: "light"
        }
    },
    kcBodyClass: {
        backgroundColor: theme.palette.background.default,
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
        backgroundSize: "cover"
    },
    // kcFormCardClass: {
    //     background: "grey",
    //     maxWidth: "500px"
    // }
} satisfies { [key in ClassKey]?: unknown }));
