import { ArrowForward, CheckCircle } from "@mui/icons-material";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    Paper,
    Stack,
    Step,
    StepButton,
    Stepper,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ContentErrorState } from "../../components/ContentState";
import { useTopicMapViewModel } from "./useTopicMapViewModel";

export function TopicMapView() {
    const { t } = useTranslation();
    const { slug } = useParams();
    const viewModel = useTopicMapViewModel(slug || "");
    if (viewModel.state === "loading") return <Typography>{t("common.loadingMap")}</Typography>;
    if (viewModel.state === "error") {
        return (
            <ContentErrorState
                error={viewModel.error}
                label={t("errors.contentLoad")}
                onRetry={viewModel.reload}
            />
        );
    }
    if (!viewModel.data) return <Typography color="text.secondary">{t("map.notFound")}</Typography>;
    const { map, nodes, edges } = viewModel.data;
    return (
        <>
            <Typography variant="overline" color="secondary.main">
                {t("map.eyebrow")}
            </Typography>
            <Typography variant="h3">{String(map.title)}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
                {String(map.description || "")}
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: { xs: 2, md: 4 } }}>
                        <Stepper orientation="vertical" activeStep={-1}>
                            {nodes.map((node) => (
                                <Step key={String(node.curriculum_topic_id)}>
                                    <StepButton
                                        icon={
                                            node.is_milestone ? (
                                                <CheckCircle color="success" />
                                            ) : undefined
                                        }
                                    >
                                        <Stack alignItems="flex-start">
                                            <Typography fontWeight={700}>
                                                {String(node.label)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {String(node.description || t("map.studyTopic"))}
                                            </Typography>
                                            <Button
                                                component={Link}
                                                to={`/topicos/${node.slug}`}
                                                size="small"
                                                endIcon={<ArrowForward />}
                                            >
                                                {t("map.openTopic")}
                                            </Button>
                                        </Stack>
                                    </StepButton>
                                </Step>
                            ))}
                        </Stepper>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{t("map.structure")}</Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                <Chip
                                    label={t("map.topicsCount", {
                                        count: nodes.length,
                                    })}
                                />
                                <Chip
                                    label={t("map.relationsCount", {
                                        count: edges.length,
                                    })}
                                />
                            </Stack>
                            <Typography color="text.secondary" sx={{ mt: 2 }}>
                                {t("map.description")}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
