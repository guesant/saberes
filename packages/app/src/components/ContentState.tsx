import Refresh from "@mui/icons-material/Refresh";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

type ContentStateProps = {
    label?: string;
};

export function ContentLoadingState({ label }: ContentStateProps) {
    const { t } = useTranslation();
    return (
        <Stack alignItems="center" role="status" aria-live="polite" sx={{ py: 10 }}>
            <CircularProgress aria-label={t("common.loadingContent")} />
            <Typography sx={{ mt: 2 }} color="text.secondary">
                {label || t("common.loadingContent")}
            </Typography>
        </Stack>
    );
}

type ContentErrorStateProps = ContentStateProps & {
    error?: unknown;
    onRetry?: () => void;
};

export function ContentErrorState({ error, label, onRetry }: ContentErrorStateProps) {
    const { t } = useTranslation();
    const message = error instanceof Error ? error.message : String(error || "");
    return (
        <Alert severity="error" role="alert" sx={{ my: 3 }}>
            <Stack spacing={1}>
                <Typography fontWeight={700}>{label || t("errors.contentLoad")}</Typography>
                <Typography variant="body2">{t("errors.contentLoadDescription")}</Typography>
                {message && (
                    <Box component="code" sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                        {message}
                    </Box>
                )}
                {onRetry && (
                    <Button
                        onClick={onRetry}
                        startIcon={<Refresh />}
                        variant="outlined"
                        color="inherit"
                        sx={{ alignSelf: "flex-start" }}
                    >
                        {t("common.retry")}
                    </Button>
                )}
            </Stack>
        </Alert>
    );
}
