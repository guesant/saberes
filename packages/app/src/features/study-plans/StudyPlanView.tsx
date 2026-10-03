import { CheckCircle, EventNote } from "@mui/icons-material";
import { Card, CardContent, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ContentErrorState } from "../../components/ContentState";
import { useStudyPlanViewModel } from "./useStudyPlanViewModel";

export function StudyPlanView() {
    const { t } = useTranslation();
    const { slug } = useParams();
    const viewModel = useStudyPlanViewModel(slug);
    if (viewModel.state === "loading") return <Typography>{t("common.loadingPlan")}</Typography>;
    if (viewModel.state === "error") {
        return (
            <ContentErrorState
                error={viewModel.error}
                label={t("errors.contentLoad")}
                onRetry={viewModel.reload}
            />
        );
    }
    if (!viewModel.data?.plan)
        return <Typography color="text.secondary">{t("plan.notFound")}</Typography>;
    const { plan, steps } = viewModel.data;
    const completed = new Set(
        viewModel.progress.filter((item) => item.completed).map((item) => String(item.stepId)),
    );
    return (
        <>
            <Typography variant="overline" color="secondary.main">
                {t("plan.eyebrow")}
            </Typography>
            <Typography variant="h3">{String(plan.title)}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
                {String(plan.objective || plan.description || "")}
            </Typography>
            <Stack spacing={2}>
                {steps.map((step) => {
                    const done = completed.has(String(step.id));
                    return (
                        <Paper
                            key={String(step.id)}
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderColor: done ? "success.main" : undefined,
                            }}
                        >
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <IconButton
                                    aria-label={done ? t("lesson.completed") : t("lesson.complete")}
                                    color={done ? "success" : "default"}
                                    onClick={() => viewModel.toggleStep(step, !done)}
                                >
                                    {done ? <CheckCircle /> : <EventNote />}
                                </IconButton>
                                <CardContent sx={{ p: 0 }}>
                                    <Typography variant="h6">
                                        {String(step.position)}. {String(step.title)}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {String(step.description || "")}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        label={done ? t("plan.completed") : t("plan.nextStep")}
                                        sx={{ mt: 1 }}
                                    />
                                </CardContent>
                            </Stack>
                        </Paper>
                    );
                })}
            </Stack>
            <Card
                sx={{
                    mt: 4,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                }}
            >
                <CardContent>{t("plan.editorialNotice")}</CardContent>
            </Card>
        </>
    );
}
