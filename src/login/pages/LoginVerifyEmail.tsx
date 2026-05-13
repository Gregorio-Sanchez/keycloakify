import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";
import Box from "@mui/material/Box";

export default function LoginVerifyEmail(
    props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, user } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("emailVerifyTitle")}
        >
            <Stack spacing={3} alignItems="center" sx={{ py: 1 }}>
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 205, 0, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <EmailIcon sx={{ fontSize: 32, color: "primary.main" }} />
                </Box>

                <Typography variant="body2" color="text.secondary" textAlign="center">
                    {msg("emailVerifyInstruction1", user?.email ?? "")}
                </Typography>

                <Typography variant="body2" color="text.secondary" textAlign="center">
                    {msg("emailVerifyInstruction2")}{" "}
                    <Link href={url.loginAction} underline="hover">
                        {msg("doClickHere")}
                    </Link>{" "}
                    {msg("emailVerifyInstruction3")}
                </Typography>

                <Button
                    fullWidth
                    variant="outlined"
                    href={url.loginAction}
                    component="a"
                    sx={{ py: 1.5 }}
                >
                    {msg("doClickHere")}
                </Button>
            </Stack>
        </Template>
    );
}
