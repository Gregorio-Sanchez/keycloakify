import { useEffect } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;
    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    const isTestEnvironment = /tst|test/i.test(realm.name);

    const handleLanguageChange = (e: SelectChangeEvent<string>) => {
        const lang = enabledLanguages.find(l => l.languageTag === e.target.value);
        if (lang) window.location.href = lang.href;
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
                px: 2
            }}
        >
            {isTestEnvironment && (
                <Chip
                    icon={<WarningAmberIcon />}
                    label="ENTORNO DE TEST"
                    sx={{
                        mb: 2,
                        backgroundColor: "#e65100",
                        color: "white",
                        fontWeight: 700,
                        letterSpacing: "0.6px",
                        fontSize: "0.75rem",
                        "& .MuiChip-icon": { color: "white" }
                    }}
                />
            )}

            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 440,
                    borderRadius: 3,
                    overflow: "hidden",
                    backgroundColor: "rgba(15, 15, 15, 0.88)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)"
                }}
            >
                {/* Card header */}
                <Box
                    sx={{
                        px: 4,
                        pt: 3,
                        pb: 2.5,
                        borderBottom: "1px solid rgba(255, 255, 255, 0.06)"
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="text.secondary"
                            letterSpacing={0.5}
                            sx={{ textTransform: "uppercase", fontSize: "0.7rem" }}
                        >
                            {realm.displayName ?? realm.name}
                        </Typography>

                        {enabledLanguages.length > 1 && (
                            <Select
                                value={currentLanguage.languageTag}
                                onChange={handleLanguageChange}
                                size="small"
                                variant="outlined"
                                sx={{
                                    fontSize: "0.75rem",
                                    "& .MuiSelect-select": { py: 0.5, pl: 1.5, pr: "28px !important" },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(255,255,255,0.12)"
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(255,255,255,0.25)"
                                    }
                                }}
                            >
                                {enabledLanguages.map(({ languageTag, label }) => (
                                    <MenuItem key={languageTag} value={languageTag} sx={{ fontSize: "0.85rem" }}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    </Stack>
                </Box>

                {/* Card content */}
                <Box sx={{ px: 4, pt: 3.5, pb: 4 }}>
                    {/* Page title / username display */}
                    <Box sx={{ mb: 3 }}>
                        {!(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                            <>
                                <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ lineHeight: 1.2 }}>
                                    {headerNode}
                                </Typography>
                                {displayRequiredFields && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                                        <Box component="span" sx={{ color: "error.main" }}>*</Box>{" "}
                                        {msg("requiredFields")}
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Typography variant="body1" color="text.secondary" fontWeight={500} sx={{ flex: 1 }}>
                                    {auth.attemptedUsername}
                                </Typography>
                                <Button
                                    component="a"
                                    href={url.loginRestartFlowUrl}
                                    variant="text"
                                    size="small"
                                    aria-label={msgStr("restartLoginTooltip")}
                                    sx={{ textTransform: "none", fontSize: "0.75rem", minWidth: "auto", p: "4px 8px" }}
                                >
                                    {msg("restartLoginTooltip")}
                                </Button>
                            </Stack>
                        )}
                    </Box>

                    {/* Alert messages */}
                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                        <Alert
                            severity={message.type === "error" ? "error" : message.type}
                            sx={{ mb: 2.5 }}
                        >
                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                        </Alert>
                    )}

                    {/* Page content */}
                    {children}

                    {/* Try another way */}
                    {auth !== undefined && auth.showTryAnotherWayLink && (
                        <Box sx={{ mt: 2.5, textAlign: "center" }}>
                            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                <input type="hidden" name="tryAnotherWay" value="on" />
                                <Button
                                    variant="text"
                                    size="small"
                                    sx={{ textTransform: "none" }}
                                    onClick={() => {
                                        (document.getElementById("kc-select-try-another-way-form") as HTMLFormElement)?.submit();
                                        return false;
                                    }}
                                >
                                    {msg("doTryAnotherWay")}
                                </Button>
                            </form>
                        </Box>
                    )}

                    {/* Social providers */}
                    {socialProvidersNode}

                    {/* Registration / info */}
                    {displayInfo && (
                        <Box
                            sx={{
                                mt: 3,
                                pt: 3,
                                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                                textAlign: "center"
                            }}
                        >
                            {infoNode}
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
