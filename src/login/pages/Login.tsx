import { useState, useReducer } from "react";
import type { ReactNode } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const hasCredentialError = messagesPerField.existsError("username", "password");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasCredentialError}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <Typography variant="body2" color="text.secondary">
                    {msg("noAccount")}{" "}
                    <Link tabIndex={8} href={url.registrationUrl} underline="hover">
                        {msg("doRegister")}
                    </Link>
                </Typography>
            }
            socialProvidersNode={
                realm.password && social?.providers !== undefined && social.providers.length > 0 ? (
                    <Box sx={{ mt: 3 }}>
                        <Divider sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                {msg("identity-provider-login-label")}
                            </Typography>
                        </Divider>
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            gap={1}
                        >
                            {(social.providers ?? []).map(p => (
                                <Button
                                    key={p.alias}
                                    id={`social-${p.alias}`}
                                    variant="outlined"
                                    href={p.loginUrl}
                                    component="a"
                                    startIcon={p.iconClasses ? <i className={p.iconClasses} aria-hidden /> : undefined}
                                    sx={{
                                        flex: (social.providers ?? []).length <= 2 ? "1 1 100%" : "1 1 calc(50% - 4px)",
                                        justifyContent: "flex-start",
                                        borderColor: "rgba(255,255,255,0.15)",
                                        color: "text.primary",
                                        "&:hover": {
                                            borderColor: "rgba(255,255,255,0.3)",
                                            backgroundColor: "rgba(255,255,255,0.04)"
                                        }
                                    }}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }} />
                                </Button>
                            ))}
                        </Stack>
                    </Box>
                ) : null
            }
        >
            <form
                id="kc-form-login"
                onSubmit={() => {
                    setIsLoginButtonDisabled(true);
                    return true;
                }}
                action={url.loginAction}
                method="post"
            >
                <Stack spacing={2.5}>
                    {!usernameHidden && (
                        <TextField
                            fullWidth
                            id="username"
                            name="username"
                            label={
                                !realm.loginWithEmailAllowed
                                    ? msg("username")
                                    : !realm.registrationEmailAsUsername
                                      ? msg("usernameOrEmail")
                                      : msg("email")
                            }
                            defaultValue={login.username ?? ""}
                            type="text"
                            autoFocus
                            autoComplete="username"
                            error={hasCredentialError}
                            helperText={
                                hasCredentialError ? (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                        }}
                                    />
                                ) : undefined
                            }
                            inputProps={{ tabIndex: 2 }}
                        />
                    )}

                    <PasswordField
                        i18n={i18n}
                        error={!!(usernameHidden && hasCredentialError)}
                        helperText={
                            usernameHidden && hasCredentialError ? (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                    }}
                                />
                            ) : undefined
                        }
                    />

                    {(realm.rememberMe && !usernameHidden) || realm.resetPasswordAllowed ? (
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            {realm.rememberMe && !usernameHidden && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="rememberMe"
                                            name="rememberMe"
                                            defaultChecked={!!login.rememberMe}
                                            size="small"
                                            inputProps={{ tabIndex: 5 }}
                                        />
                                    }
                                    label={<Typography variant="body2">{msg("rememberMe")}</Typography>}
                                />
                            )}
                            {realm.resetPasswordAllowed && (
                                <Link
                                    tabIndex={6}
                                    href={url.loginResetCredentialsUrl}
                                    underline="hover"
                                    variant="body2"
                                    sx={{ ml: "auto" }}
                                >
                                    {msg("doForgotPassword")}
                                </Link>
                            )}
                        </Stack>
                    ) : null}

                    <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />

                    <Button
                        fullWidth
                        tabIndex={7}
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoginButtonDisabled}
                        sx={{ py: 1.5, fontSize: "0.95rem" }}
                    >
                        {msg("doLogIn")}
                    </Button>
                </Stack>
            </form>
        </Template>
    );
}

function PasswordField(props: { i18n: I18n; error: boolean; helperText?: ReactNode }) {
    const { i18n, error, helperText } = props;
    const { msg, msgStr } = i18n;
    const [showPassword, toggleShowPassword] = useReducer((v: boolean) => !v, false);

    return (
        <TextField
            fullWidth
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label={msg("password")}
            autoComplete="current-password"
            error={error}
            helperText={helperText}
            inputProps={{ tabIndex: 3 }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={msgStr(showPassword ? "hidePassword" : "showPassword")}
                            onClick={toggleShowPassword}
                            edge="end"
                            size="small"
                        >
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    );
}
