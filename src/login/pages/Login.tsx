import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button, Checkbox, FormControl, FormControlLabel, FormHelperText, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// import "./login.css";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {

    const [showPassword, setShowPassword] = useState(false);

    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={

                <Typography variant="body1" component="div">
                    {msg("noAccount")}{" "}
                    <Link tabIndex={8} href={url.registrationUrl}>
                        {msg("doRegister")}
                    </Link>
                </Typography>

            }
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                            <hr />
                            <h2>{msg("identity-provider-login-label")}</h2>
                            <ul className={kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")}>
                                {social.providers.map((...[p, , providers]) => (
                                    <li key={p.alias}>
                                        <a
                                            id={`social-${p.alias}`}
                                            className={kcClsx(
                                                "kcFormSocialAccountListButtonClass",
                                                providers.length > 3 && "kcFormSocialAccountGridItem"
                                            )}
                                            type="button"
                                            href={p.loginUrl}
                                        >
                                            {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}
                                            <span
                                                className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}
                                                dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                            ></span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            }
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                        >
                            {!usernameHidden && (
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <TextField
                                        sx={{
                                            width: "100%",
                                            minWidth: 300,
                                            pb: 1,
                                        }}
                                        label={
                                            !realm.loginWithEmailAllowed
                                                ? msg("username")
                                                : !realm.registrationEmailAsUsername
                                                    ? msg("usernameOrEmail")
                                                    : msg("email")
                                        }
                                        tabIndex={2}
                                        variant="outlined"
                                        name="username"
                                        defaultValue={login.username ?? ""}
                                        autoFocus
                                        autoComplete="username"
                                        error={messagesPerField.existsError("username", "password")}
                                        helperText={
                                            messagesPerField.existsError("username", "password") && (
                                                <span
                                                    aria-live="polite"
                                                    dangerouslySetInnerHTML={{
                                                        __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                                    }}
                                                />
                                            )
                                        }
                                    />
                                </div>
                            )}

                            <div className={kcClsx("kcFormGroupClass")}>
                                <FormControl sx={{ width: "100%" }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">{msg("password")}</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        tabIndex={3}
                                        id="outlined-adornment-password"
                                        name="password"
                                        autoComplete="current-password"
                                        type={showPassword ? 'text' : 'password'}
                                        error={messagesPerField.existsError("username", "password")}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                        showPassword ? 'hide the password' : 'display the password'
                                                    }
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    onMouseDown={e => e.preventDefault()}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                    {usernameHidden && messagesPerField.existsError("username", "password") && (
                                        <FormHelperText>
                                            <span
                                                aria-live="polite"
                                                dangerouslySetInnerHTML={{
                                                    __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                                }}
                                            />
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </div>

                            <div className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
                                <div id="kc-form-options">
                                    {realm.rememberMe && !usernameHidden && (
                                        <FormControlLabel
                                            control={<Checkbox
                                                defaultChecked={!!login.rememberMe}
                                                name="rememberMe"
                                                tabIndex={5}
                                            />}
                                            label={msg("rememberMe")}
                                        />
                                    )}
                                </div>
                                <div className={kcClsx("kcFormOptionsWrapperClass")}>
                                    {realm.resetPasswordAllowed && (
                                        <span>
                                            <Link
                                                sx={{ mt: 2, display: "inline-block" }}
                                                color={"secondary"}
                                                tabIndex={6}
                                                href={url.loginResetCredentialsUrl}
                                            >
                                                {msg("doForgotPassword")}
                                            </Link>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />

                                <Button
                                    sx={{
                                        width: "100%",
                                        backgroundColor: "#ffcd00",
                                        borderRadius: "8px",
                                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
                                    }}
                                    tabIndex={7}
                                    type="submit"
                                    name="login"
                                    variant="contained"
                                    disabled={isLoginButtonDisabled}
                                >
                                    {msg("doLogIn")}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}