import { BookmarkBorder, CheckCircle } from "@mui/icons-material";
import {
    Box,
    Button,
    Divider,
    Grid,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ContentRenderer } from "../../content/ContentRenderer";
import { useLessonViewModel } from "./useLessonViewModel";

export function LessonView() {
    const { t } = useTranslation();
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const viewModel = useLessonViewModel(`lesson:${lessonId}`);
    const [completed, setCompleted] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    if (viewModel.state === "loading")
        return <Typography>{t("common.loadingLesson")}</Typography>;
    if (!viewModel.data)
        return (
            <Typography color="text.secondary">
                {t("lesson.notFound")}
            </Typography>
        );
    const lesson = viewModel.data.lesson;
    const data = viewModel.data;
    return (
        <>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                gap={2}
                sx={{ mb: 4 }}
            >
                <Box>
                    <Typography variant="overline" color="secondary.main">
                        {t("lesson.label")}
                    </Typography>
                    <Typography variant="h3">{String(lesson.title)}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {String(lesson.intro || "")}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<BookmarkBorder />}
                        onClick={async () => {
                            await viewModel.saveBookmark();
                            setBookmarked(true);
                        }}
                    >
                        {bookmarked ? t("lesson.saved") : t("lesson.save")}
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<CheckCircle />}
                        onClick={async () => {
                            const next = !completed;
                            await viewModel.saveProgress(next);
                            setCompleted(next);
                        }}
                    >
                        {completed
                            ? t("lesson.completed")
                            : t("lesson.complete")}
                    </Button>
                </Stack>
            </Stack>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper
                        variant="outlined"
                        sx={{ p: 2, position: { md: "sticky" }, top: 88 }}
                    >
                        <Typography variant="subtitle2">
                            {t("lesson.tableOfContents")}
                        </Typography>
                        <List dense>
                            {data.sections.map((section, index) => (
                                <ListItemButton
                                    key={String(section.id)}
                                    component="a"
                                    href={`#section-${String(section.id)}`}
                                >
                                    <ListItemText
                                        primary={`${index + 1}. ${String(section.title || t("common.content"))}`}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 9 }}>
                    <Paper sx={{ p: { xs: 2, md: 5 } }}>
                        {data.sections.map((section) => (
                            <Box
                                id={`section-${String(section.id)}`}
                                key={String(section.id)}
                                sx={{ mb: 5, scrollMarginTop: 100 }}
                            >
                                <Typography variant="h4" sx={{ mb: 2 }}>
                                    {String(
                                        section.title || t("lesson.theory"),
                                    )}
                                </Typography>
                                <ContentRenderer
                                    markdown={String(section.content || "")}
                                    blocksJson={
                                        section.blocks_json as
                                            | string
                                            | undefined
                                    }
                                    onQuestion={(questionId: string | number) =>
                                        navigate(`/questoes/${questionId}`)
                                    }
                                />
                            </Box>
                        ))}
                        <Divider sx={{ my: 4 }} />
                        <Button
                            component={Link}
                            to="/questoes"
                            variant="contained"
                        >
                            {t("lesson.practice")}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}
