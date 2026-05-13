import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export default function LoginResetPassword(
    props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, realm, auth, messagesPerField } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username")}
            headerNode={msg("emailForgotTitle")}
        >
            <form action={url.loginAction} method="post">
                <Stack spacing={2.5}>
                    <Typography variant="body2" color="text.secondary">
                        {msg("emailInstruction")}
                    </Typography>

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
                        defaultValue={auth.attemptedUsername ?? ""}
                        autoFocus
                        autoComplete="username"
                        error={messagesPerField.existsError("username")}
                        helperText={
                            messagesPerField.existsError("username") ? (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.getFirstError("username"))
                                    }}
                                />
                            ) : undefined
                        }
                        inputProps={{ tabIndex: 2 }}
                    />

                    <Button
                        fullWidth
                        tabIndex={4}
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ py: 1.5, fontSize: "0.95rem" }}
                    >
                        {msg("doSubmit")}
                    </Button>

                    <Typography variant="body2" textAlign="center">
                        <Link tabIndex={5} href={url.loginUrl} underline="hover">
                            {msg("backToLogin")}
                        </Link>
                    </Typography>
                </Stack>
            </form>
        </Template>
    );
}
