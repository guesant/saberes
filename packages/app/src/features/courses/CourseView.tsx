import { CheckCircle, PlayArrow } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ContentErrorState } from "../../components/ContentState";
import { useCourseViewModel } from "./useCourseViewModel";

export function CourseView() {
    const { t } = useTranslation();
    const { slug } = useParams();
    const viewModel = useCourseViewModel(slug);
    const [started, setStarted] = useState(false);
    if (viewModel.state === "loading") return <Typography>{t("common.loadingCourse")}</Typography>;
    if (viewModel.state === "error") {
        return (
            <ContentErrorState
                error={viewModel.error}
                label={t("errors.contentLoad")}
                onRetry={viewModel.reload}
            />
        );
    }
    if (!viewModel.data)
        return <Typography color="text.secondary">{t("course.notFound")}</Typography>;
    const data = viewModel.data;
    const course = data.course;
    const courseType =
        course.course_type === "specific" ? t("course.specific") : t("course.general");
    return (
        <>
            <Card
                sx={{
                    p: { xs: 2, md: 5 },
                    mb: 4,
                    color: "white",
                    background: "linear-gradient(120deg, #121b35 0%, #273b72 65%, #523a8b 100%)",
                }}
            >
                <Chip label={courseType} sx={{ color: "white" }} variant="outlined" />
                <Typography variant="h2" sx={{ mt: 2 }}>
                    {String(course.title)}
                </Typography>
                <Typography sx={{ mt: 2, maxWidth: 720, opacity: 0.86 }}>
                    {String(course.description || "")}
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={started ? <CheckCircle /> : <PlayArrow />}
                    onClick={async () => {
                        await viewModel.startCourse();
                        setStarted(true);
                    }}
                    sx={{ mt: 3 }}
                >
                    {started ? t("course.continue") : t("course.start")}
                </Button>
            </Card>
            <Typography variant="h5" sx={{ mb: 2 }}>
                {t("course.learnInSequence")}
            </Typography>
            <Stack spacing={2}>
                {data.modules.map((module) => (
                    <Card key={String(module.id)}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 2.5, bgcolor: "background.default" }}>
                                <Typography variant="h6">
                                    {String(module.position)}. {String(module.title)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {String(module.description || "")}
                                </Typography>
                            </Box>
                            <List disablePadding>
                                {data.items
                                    .filter((item) => item.module_id === module.id)
                                    .map((item) => (
                                        <ListItem
                                            key={String(item.id)}
                                            divider
                                            secondaryAction={
                                                item.lesson_id ? (
                                                    <Button
                                                        component={Link}
                                                        to={`/licoes/${item.lesson_id}`}
                                                    >
                                                        {t("common.study")}
                                                    </Button>
                                                ) : (
                                                    <Chip
                                                        label={String(
                                                            item.item_type || t("course.practice"),
                                                        )}
                                                        size="small"
                                                    />
                                                )
                                            }
                                        >
                                            <ListItemText
                                                primary={String(item.title)}
                                                secondary={String(item.description || "")}
                                            />
                                        </ListItem>
                                    ))}
                            </List>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </>
    );
}
