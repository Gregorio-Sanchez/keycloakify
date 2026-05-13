import { useState, useReducer } from "react";
import type { ReactNode } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginUpdatePassword(
    props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;
    const { msg } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={
                !messagesPerField.existsError("password", "password-confirm")
            }
            headerNode={msg("updatePasswordTitle")}
        >
            <form
                action={url.loginAction}
                method="post"
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
            >
                <Stack spacing={2.5}>
                    <input type="text" id="username" name="username" autoComplete="username" readOnly style={{ display: "none" }} />

                    <PasswordField
                        id="password-new"
                        name="password-new"
                        label={msg("passwordNew")}
                        autoComplete="new-password"
                        i18n={i18n}
                        tabIndex={2}
                        error={messagesPerField.existsError("password")}
                        helperText={
                            messagesPerField.existsError("password") ? (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.getFirstError("password"))
                                    }}
                                />
                            ) : undefined
                        }
                    />

                    <PasswordField
                        id="password-confirm"
                        name="password-confirm"
                        label={msg("passwordConfirm")}
                        autoComplete="new-password"
                        i18n={i18n}
                        tabIndex={3}
                        error={messagesPerField.existsError("password-confirm")}
                        helperText={
                            messagesPerField.existsError("password-confirm") ? (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.getFirstError("password-confirm"))
                                    }}
                                />
                            ) : undefined
                        }
                    />

                    <Stack direction="row" spacing={1.5}>
                        <Button
                            fullWidth
                            tabIndex={4}
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            sx={{ py: 1.5, fontSize: "0.95rem" }}
                        >
                            {msg("doSubmit")}
                        </Button>

                        {isAppInitiatedAction && (
                            <Button
                                fullWidth
                                tabIndex={5}
                                type="submit"
                                name="cancel-aia"
                                value="true"
                                variant="outlined"
                                sx={{ py: 1.5 }}
                            >
                                {msg("doCancel")}
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </form>
        </Template>
    );
}

function PasswordField(props: {
    id: string;
    name: string;
    label: ReactNode;
    autoComplete: string;
    i18n: I18n;
    tabIndex: number;
    error: boolean;
    helperText?: ReactNode;
}) {
    const { id, name, label, autoComplete, i18n, tabIndex, error, helperText } = props;
    const { msgStr } = i18n;
    const [showPassword, toggleShowPassword] = useReducer((v: boolean) => !v, false);

    return (
        <TextField
            fullWidth
            id={id}
            name={name}
            type={showPassword ? "text" : "password"}
            label={label}
            autoComplete={autoComplete}
            autoFocus={tabIndex === 2}
            error={error}
            helperText={helperText}
            inputProps={{ tabIndex }}
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
