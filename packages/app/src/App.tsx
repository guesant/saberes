// @ts-nocheck
import {
    clearProgress,
    enrollCourse,
    getSession,
    getSetting,
    getStreak,
    listAchievements,
    listAttempts,
    listBookmarks,
    listEnrollments,
    listLessonProgress,
    listPlanProgress,
    listReviewTargets,
    saveAttempt,
    saveBookmark,
    saveDailyChallenge,
    saveDiagnosis,
    saveLessonProgress,
    savePlanProgress,
    saveReviewItem,
    saveReviewTarget,
    saveSession,
} from "@guesant/saberes-adapter-data-v1/progress";
import {
    achievementDefinitions,
    actionForDiagnosis,
    addStudyPoints,
    recordStudyActivity,
    scheduleReview,
    suggestDiagnosis,
    syncAchievements,
} from "@guesant/saberes-adapter-data-v1/study";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ExploreIcon from "@mui/icons-material/Explore";
import MapIcon from "@mui/icons-material/Map";
import MenuIcon from "@mui/icons-material/Menu";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import QuizIcon from "@mui/icons-material/Quiz";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import {
    Alert,
    AppBar,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Container,
    Divider,
    Drawer,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Stack,
    Step,
    StepButton,
    Stepper,
    Tab,
    Tabs,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
    Link,
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { ContentRenderer } from "./content/ContentRenderer";
import { ContentErrorBoundary } from "./components/ContentErrorBoundary";
import { ContentLoadingState } from "./components/ContentState";
import { useContent } from "./db/ContentContext";
import { CatalogView } from "./features/catalog/CatalogView";
import { CourseView } from "./features/courses/CourseView";
import { QuestionView } from "./features/exercises/QuestionView";
import { LessonView } from "./features/lessons/LessonView";
import { TopicMapView } from "./features/maps/TopicMapView";
import { StudyPlanView } from "./features/study-plans/StudyPlanView";
import { useQuery } from "./hooks";

const commonSubjects = [
    "matematica",
    "lingua-portuguesa",
    "literatura",
    "fisica",
    "quimica",
    "biologia",
    "historia",
    "geografia",
    "ingles",
    "filosofia",
    "sociologia",
];

function Shell({ children }) {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const { t } = useTranslation();
    const links = [
        ["/", t("nav.home")],
        ["/catalogo", t("nav.catalog")],
        ["/plano", t("nav.studyPlan")],
        ["/mapa", t("nav.map")],
        ["/meu-estudo", t("nav.myStudy")],
        ["/topicos", t("nav.topics")],
        ["/questoes", t("nav.questions")],
        ["/simulado", t("nav.simulator")],
        ["/desempenho", t("nav.performance")],
        ["/revisao", t("nav.review")],
    ];
    const nav = (
        <List>
            {links.map(([to, label]) => (
                <ListItem key={to} disablePadding>
                    <ListItemButton
                        component={Link}
                        to={to}
                        selected={to !== "/" && location.pathname.startsWith(to)}
                        onClick={() => setOpen(false)}
                    >
                        <ListItemText primary={label} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
    return (
        <Box sx={{ minHeight: "100vh" }}>
            <AppBar position="sticky" color="primary">
                <Toolbar>
                    <IconButton
                        aria-label={t("common.openMenu")}
                        color="inherit"
                        edge="start"
                        sx={{
                            display: { xs: "inline-flex", md: "none" },
                            mr: 1,
                        }}
                        onClick={() => setOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component={Link}
                        to="/"
                        variant="h6"
                        sx={{
                            color: "inherit",
                            textDecoration: "none",
                            fontWeight: 700,
                            flexGrow: 1,
                        }}
                    >
                        {t("brand.name")}
                    </Typography>
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                        {links.slice(1).map(([to, label]) => (
                            <Button key={to} component={Link} to={to} color="inherit">
                                {label}
                            </Button>
                        ))}
                    </Box>
                    <Chip
                        icon={<OfflineBoltIcon />}
                        label={t("common.offline")}
                        size="small"
                        sx={{
                            ml: 1,
                            color: "white",
                            borderColor: "rgba(255,255,255,.4)",
                        }}
                        variant="outlined"
                    />
                </Toolbar>
            </AppBar>
            <Drawer open={open} onClose={() => setOpen(false)}>
                {nav}
            </Drawer>
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
                {children}
            </Container>
            <Box component="footer" sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
                {t("brand.name")} · {t("brand.footer")}
            </Box>
        </Box>
    );
}
function Loading() {
    return <ContentLoadingState />;
}
function Empty({ children }) {
    return (
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">{children}</Typography>
        </Paper>
    );
}
function PageTitle({ eyebrow, title, description, action }) {
    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            gap={2}
            sx={{ mb: 4 }}
        >
            <Box>
                <Typography variant="overline" color="secondary.main" fontWeight={700}>
                    {eyebrow}
                </Typography>
                <Typography variant="h3" sx={{ mt: 0.5 }}>
                    {title}
                </Typography>
                {description && (
                    <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 740 }}>
                        {description}
                    </Typography>
                )}
            </Box>
            {action}
        </Stack>
    );
}
function StatCard({ value, label }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h3" color="primary.main">
                    {value}
                </Typography>
                <Typography color="text.secondary">{label}</Typography>
            </CardContent>
        </Card>
    );
}

function Dashboard() {
    const { t } = useTranslation();
    const exams = useQuery(
        "SELECT e.id, e.year, e.name, ap.name process_name, ap.slug process_slug FROM editions e JOIN admission_processes ap ON ap.id = e.admission_process_id WHERE e.is_published = 1 ORDER BY e.year DESC, ap.name LIMIT 12",
    );
    const topics = useQuery(
        "SELECT ct.id, ct.label name, ct.description, t.slug, GROUP_CONCAT(s.name, ', ') subject FROM curriculum_topics ct JOIN curricula c ON c.id = ct.curriculum_id JOIN editions e ON e.id = c.edition_id JOIN topics t ON t.id = ct.topic_id LEFT JOIN topic_subjects ts ON ts.topic_id = t.id LEFT JOIN subjects s ON s.id = ts.subject_id WHERE e.is_published = 1 AND ct.parent_id IS NULL GROUP BY ct.id ORDER BY e.year DESC, ct.position LIMIT 6",
    );
    const dailyQuestions = useQuery(
        "SELECT qo.id occurrence_id, qo.occurrence_key, qo.number, e.year, ap.name process_name, s.name subject FROM question_occurrences qo JOIN questions q ON q.id = qo.question_id JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id LEFT JOIN subjects s ON s.id = qo.subject_id WHERE q.status = 'published' ORDER BY qo.id",
    );
    const [attempts, setAttempts] = useState([]);
    const [daily, setDaily] = useState(null);
    useEffect(() => {
        listAttempts().then(setAttempts);
    }, []);
    useEffect(() => {
        if (!dailyQuestions.data.length) return;
        const date = new Date().toISOString().slice(0, 10);
        const index =
            [...date].reduce((sum, character) => sum + character.charCodeAt(0), 0) %
            dailyQuestions.data.length;
        const item = dailyQuestions.data[index];
        setDaily({ ...item, date });
        saveDailyChallenge(`daily:${date}`, {
            date,
            questionId: item.occurrence_id,
            contentKey: item.occurrence_key || `question:${item.occurrence_id}`,
        });
    }, [dailyQuestions.data]);
    if (exams.loading || topics.loading || dailyQuestions.loading) return <Loading />;
    const processCount = new Set(exams.data.map((edition) => edition.process_slug)).size;
    const years = exams.data
        .map((edition) => Number(edition.year))
        .filter((value) => Number.isFinite(value));
    const yearRange = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : "—";
    return (
        <>
            <PageTitle
                eyebrow={t("home.eyebrow")}
                title={t("home.title")}
                description={t("home.description")}
                action={
                    <Button
                        component={Link}
                        to="/simulado"
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                    >
                        {t("home.buildSimulator")}
                    </Button>
                }
            />
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} md={3}>
                    <StatCard value={attempts.length} label={t("home.answeredQuestions")} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard
                        value={attempts.filter((a) => a.isCorrect).length}
                        label={t("home.correctAnswers")}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard value={processCount} label={t("home.selectionProcesses")} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard value={yearRange} label={t("home.editionsInDatabase")} />
                </Grid>
            </Grid>
            {daily && (
                <Card
                    sx={{
                        mb: 4,
                        bgcolor: "secondary.main",
                        color: "secondary.contrastText",
                    }}
                >
                    <CardContent>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            gap={2}
                        >
                            <Box>
                                <Typography variant="overline">
                                    {t("home.dailyQuestion")} · {daily.subject || "vestibular"}
                                </Typography>
                                <Typography variant="h5">
                                    {daily.process_name} {daily.year} · questão {daily.number}
                                </Typography>
                                <Typography sx={{ mt: 0.5, opacity: 0.9 }}>
                                    {t("home.dailyQuestionDescription")}
                                </Typography>
                            </Box>
                            <Button
                                component={Link}
                                to={`/questoes/${daily.occurrence_id}`}
                                variant="contained"
                                color="primary"
                            >
                                {t("home.solveNow")}
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            )}
            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {t("home.startWithTopic")}
                    </Typography>
                    <Grid container spacing={2}>
                        {topics.data.map((topic) => (
                            <Grid item xs={12} sm={6} key={topic.id}>
                                <Card>
                                    <CardActionArea component={Link} to={`/topicos/${topic.slug}`}>
                                        <CardContent>
                                            <Chip
                                                size="small"
                                                label={topic.subject || t("common.content")}
                                                color="secondary"
                                                sx={{ mb: 1.5 }}
                                            />
                                            <Typography variant="h6">{topic.name}</Typography>
                                            <Typography
                                                color="text.secondary"
                                                variant="body2"
                                                sx={{ mt: 1 }}
                                            >
                                                {topic.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {t("home.databaseEditions")}
                    </Typography>
                    <Stack spacing={1.5}>
                        {exams.data.map((edition) => (
                            <Paper
                                key={edition.id}
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    <Typography fontWeight={700}>
                                        {edition.process_name} {edition.year}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {edition.name}
                                    </Typography>
                                </Box>
                                <Button
                                    component={Link}
                                    to={`/questoes?process=${edition.process_slug}&year=${edition.year}`}
                                >
                                    {t("home.view")}
                                </Button>
                            </Paper>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}

function TopicBrowser() {
    const { t } = useTranslation();
    const topics = useQuery(
        "SELECT ct.id, ct.label name, ct.description, t.slug, GROUP_CONCAT(s.name, ', ') subject FROM curriculum_topics ct JOIN curricula c ON c.id = ct.curriculum_id JOIN editions e ON e.id = c.edition_id JOIN topics t ON t.id = ct.topic_id LEFT JOIN topic_subjects ts ON ts.topic_id = t.id LEFT JOIN subjects s ON s.id = ts.subject_id WHERE e.is_published = 1 AND ct.parent_id IS NULL GROUP BY ct.id ORDER BY e.year DESC, ct.position",
    );
    if (topics.loading) return <Loading />;
    return (
        <>
            <PageTitle
                eyebrow={t("topics.eyebrow")}
                title={t("topics.title")}
                description={t("topics.description")}
            />
            <Grid container spacing={2}>
                {topics.data.map((topic) => (
                    <Grid item xs={12} sm={6} md={4} key={topic.id}>
                        <Card sx={{ height: "100%" }}>
                            <CardActionArea
                                component={Link}
                                to={`/topicos/${topic.slug}`}
                                sx={{ height: "100%" }}
                            >
                                <CardContent>
                                    <Chip
                                        size="small"
                                        label={topic.subject || t("common.content")}
                                        color="secondary"
                                        sx={{ mb: 2 }}
                                    />
                                    <Typography variant="h6">{topic.name}</Typography>
                                    <Typography
                                        color="text.secondary"
                                        variant="body2"
                                        sx={{ mt: 1 }}
                                    >
                                        {topic.description}
                                    </Typography>
                                    <Button sx={{ mt: 2 }} endIcon={<ArrowForwardIcon />}>
                                        {t("topics.study")}
                                    </Button>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

function TopicStudy() {
    const { t } = useTranslation();
    const { slug } = useParams();
    const topic = useQuery(
        "SELECT ct.id, ct.topic_id, ct.parent_id, ct.curriculum_id, ct.label name, ct.description, t.slug, e.year, ap.name process_name, ap.slug process_slug, GROUP_CONCAT(s.name, ', ') subject FROM curriculum_topics ct JOIN curricula c ON c.id = ct.curriculum_id JOIN editions e ON e.id = c.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id JOIN topics t ON t.id = ct.topic_id LEFT JOIN topic_subjects ts ON ts.topic_id = t.id LEFT JOIN subjects s ON s.id = ts.subject_id WHERE e.is_published = 1 AND t.slug = ? GROUP BY ct.id ORDER BY e.year DESC LIMIT 1",
        [slug],
        [slug],
    );
    const current = topic.data[0];
    const lessons = useQuery(
        "SELECT l.* FROM lessons l JOIN lesson_topics lt ON lt.lesson_id = l.id WHERE lt.curriculum_topic_id = ? AND l.is_published = 1 ORDER BY l.id",
        [current?.id ?? 0],
        [current?.id],
    );
    const sections = useQuery(
        "SELECT ls.* FROM lesson_sections ls JOIN lesson_topics lt ON lt.lesson_id = ls.lesson_id WHERE lt.curriculum_topic_id = ? ORDER BY ls.lesson_id, ls.position",
        [current?.id ?? 0],
        [current?.id],
    );
    const questions = useQuery(
        "SELECT qo.id, qo.number, q.subject, q.difficulty, e.year, ap.name process_name FROM question_occurrences qo JOIN questions q ON q.id = qo.question_id JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id JOIN question_topics qt ON qt.question_occurrence_id = qo.id WHERE qt.curriculum_topic_id = ? AND q.status = 'published' ORDER BY e.year DESC, qo.number LIMIT 12",
        [current?.id ?? 0],
        [current?.id],
    );
    const resources = useQuery(
        "SELECT r.* FROM resources r JOIN resource_topics rt ON rt.resource_id = r.id WHERE rt.curriculum_topic_id = ? AND r.is_published = 1",
        [current?.id ?? 0],
        [current?.id],
    );
    const relations = useQuery(
        "SELECT tr.relation_type, t2.slug, COALESCE(ct2.label, t2.name) name FROM topic_relations tr JOIN topics t2 ON t2.id = CASE WHEN tr.topic_id = ? THEN tr.related_topic_id ELSE tr.topic_id END LEFT JOIN curriculum_topics ct2 ON ct2.topic_id = t2.id AND ct2.curriculum_id = ? WHERE tr.topic_id = ? OR tr.related_topic_id = ? ORDER BY tr.relation_type, name",
        [
            current?.topic_id ?? 0,
            current?.curriculum_id ?? 0,
            current?.topic_id ?? 0,
            current?.topic_id ?? 0,
        ],
        [current?.topic_id, current?.curriculum_id],
    );
    const siblings = useQuery(
        "SELECT ct2.id, ct2.label name, t2.slug FROM curriculum_topics ct2 JOIN topics t2 ON t2.id = ct2.topic_id WHERE ct2.curriculum_id = ? AND ct2.parent_id = ? AND ct2.id <> ? ORDER BY ct2.position",
        [current?.curriculum_id ?? 0, current?.parent_id ?? 0, current?.id ?? 0],
        [current?.curriculum_id, current?.parent_id, current?.id],
    );
    if (topic.loading || relations.loading || siblings.loading) return <Loading />;
    if (!current) return <Empty>{t("topics.notFound")}</Empty>;
    let theoryContent = null;
    if (sections.data.length) {
        theoryContent = sections.data.map((section) => (
            <Card key={section.id} sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h5">{section.title || t("common.content")}</Typography>
                    <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8, mt: 2 }}>
                        {section.content}
                    </Typography>
                </CardContent>
            </Card>
        ));
    } else if (lessons.data.length) {
        theoryContent = lessons.data.map((lesson) => (
            <Card key={lesson.id} sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h5">{lesson.title}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {lesson.intro}
                    </Typography>
                </CardContent>
            </Card>
        ));
    } else {
        theoryContent = <Empty>{t("topics.theoryPending")}</Empty>;
    }
    return (
        <>
            <PageTitle
                eyebrow={`${current.process_name} ${current.year} · ${current.subject || t("common.content")}`}
                title={current.name}
                description={current.description}
                action={
                    <Button
                        component={Link}
                        to={`/questoes?topic=${current.id}${current.process_slug ? `&process=${current.process_slug}` : ""}`}
                        variant="contained"
                    >
                        {t("topics.train")}
                    </Button>
                }
            />
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {t("topics.theory")}
                    </Typography>
                    {theoryContent}
                    <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                        {t("topics.relatedQuestions")}
                    </Typography>
                    {questions.data.map((question) => (
                        <Paper
                            key={question.id}
                            variant="outlined"
                            sx={{
                                p: 2,
                                mb: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Box>
                                <Typography fontWeight={600}>
                                    {question.process_name} {question.year} · questão{" "}
                                    {question.number}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {question.subject} · {question.difficulty}
                                </Typography>
                            </Box>
                            <Button component={Link} to={`/questoes/${question.id}`}>
                                {t("common.solve")}
                            </Button>
                        </Paper>
                    ))}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {t("topics.freeMaterials")}
                    </Typography>
                    {resources.data.map((resource) => (
                        <Card key={resource.id} sx={{ mb: 1.5 }}>
                            <CardContent>
                                <Typography fontWeight={700}>{resource.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                                    {resource.description}
                                </Typography>
                                <Button
                                    href={resource.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    size="small"
                                >
                                    {t("topics.openMaterial")}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {(relations.data.length || siblings.data.length) > 0 && (
                        <>
                            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                                {t("topics.connectedTopics")}
                            </Typography>
                            <Stack spacing={1}>
                                {siblings.data.map((item) => (
                                    <Paper
                                        key={`sibling-${item.id}`}
                                        variant="outlined"
                                        sx={{ p: 1.5 }}
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            {t("topics.sibling")}
                                        </Typography>
                                        <Button
                                            component={Link}
                                            to={`/topicos/${item.slug}`}
                                            sx={{ px: 0 }}
                                        >
                                            {item.name}
                                        </Button>
                                    </Paper>
                                ))}
                                {relations.data.map((item) => (
                                    <Paper
                                        key={`${item.slug}-${item.relation_type}`}
                                        variant="outlined"
                                        sx={{ p: 1.5 }}
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            {relationLabel(item.relation_type, t)}
                                        </Typography>
                                        <Button
                                            component={Link}
                                            to={`/topicos/${item.slug}`}
                                            sx={{ px: 0 }}
                                        >
                                            {item.name}
                                        </Button>
                                    </Paper>
                                ))}
                            </Stack>
                        </>
                    )}
                </Grid>
            </Grid>
        </>
    );
}

function relationLabel(relationType, translate) {
    if (relationType === "prerequisite") return translate("topics.prerequisite");
    if (relationType === "similar") return translate("topics.similar");
    return translate("topics.related");
}
function QuestionBrowser() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [processSlug, setProcessSlug] = useState(searchParams.get("process") || "");
    const [year, setYear] = useState(searchParams.get("year") || "");
    const [subject, setSubject] = useState(searchParams.get("subject") || "");
    const [topic, setTopic] = useState(searchParams.get("topic") || "");
    const where = ["q.status = 'published'"];
    const params = [];
    if (processSlug) {
        where.push("ap.slug = ?");
        params.push(processSlug);
    }
    if (year) {
        where.push("e.year = ?");
        params.push(Number(year));
    }
    if (subject) {
        where.push("s.slug = ?");
        params.push(subject);
    }
    if (topic) {
        where.push("qt.curriculum_topic_id = ?");
        params.push(Number(topic));
    }
    const questions = useQuery(
        `SELECT qo.id, qo.number, q.type, q.difficulty, e.year, ap.name process_name, s.name subject, st.name stage_name FROM question_occurrences qo JOIN questions q ON q.id = qo.question_id JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id LEFT JOIN subjects s ON s.id = qo.subject_id LEFT JOIN question_topics qt ON qt.question_occurrence_id = qo.id WHERE ${where.join(" AND ")} ORDER BY e.year DESC, qo.number`,
        params,
        [processSlug, year, subject, topic],
    );
    const topics = useQuery(
        "SELECT DISTINCT ct.id, ct.label name FROM curriculum_topics ct JOIN curricula c ON c.id = ct.curriculum_id JOIN editions e ON e.id = c.edition_id WHERE e.is_published = 1 ORDER BY ct.label",
    );
    const processes = useQuery(
        "SELECT slug, name FROM admission_processes WHERE is_published = 1 ORDER BY name",
    );
    const years = useQuery(
        "SELECT DISTINCT year FROM editions WHERE is_published = 1 ORDER BY year DESC",
    );
    const update = (setter, value, key) => {
        setter(value);
        const next = new URLSearchParams(searchParams);
        value ? next.set(key, value) : next.delete(key);
        setSearchParams(next);
    };
    if (questions.loading || topics.loading || processes.loading || years.loading)
        return <Loading />;
    return (
        <>
            <PageTitle
                eyebrow={t("questionBank.eyebrow")}
                title={t("questionBank.title")}
                description={t("questionBank.description")}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>{t("common.selectionProcess")}</InputLabel>
                    <Select
                        value={processSlug}
                        label={t("common.selectionProcess")}
                        onChange={(e) => update(setProcessSlug, e.target.value, "process")}
                    >
                        <MenuItem value="">{t("common.all")}</MenuItem>
                        {processes.data.map((item) => (
                            <MenuItem key={item.slug} value={item.slug}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>{t("common.subject")}</InputLabel>
                    <Select
                        value={subject}
                        label={t("common.subject")}
                        onChange={(e) => update(setSubject, e.target.value, "subject")}
                    >
                        <MenuItem value="">{t("common.allFemale")}</MenuItem>
                        {commonSubjects.map((item) => (
                            <MenuItem key={item} value={item}>
                                {item.replaceAll("-", " ")}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>{t("common.year")}</InputLabel>
                    <Select
                        value={year}
                        label={t("common.year")}
                        onChange={(e) => update(setYear, e.target.value, "year")}
                    >
                        <MenuItem value="">{t("common.all")}</MenuItem>
                        {years.data.map((item) => (
                            <MenuItem key={item.year} value={item.year}>
                                {item.year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>{t("common.topic")}</InputLabel>
                    <Select
                        value={topic}
                        label={t("common.topic")}
                        onChange={(e) => update(setTopic, e.target.value, "topic")}
                    >
                        <MenuItem value="">{t("common.all")}</MenuItem>
                        {topics.data.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
                {t("questionBank.found", { count: questions.data.length })}
            </Typography>
            <Stack spacing={1.5}>
                {questions.data.map((question) => (
                    <Paper
                        key={question.id}
                        variant="outlined"
                        sx={{
                            p: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography fontWeight={700}>
                                {question.process_name} {question.year} · questão {question.number}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {question.stage_name} ·{" "}
                                {question.subject || t("common.generalExam")} · {question.type}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            component={Link}
                            to={`/questoes/${question.id}`}
                        >
                            {t("common.solve")}
                        </Button>
                    </Paper>
                ))}
            </Stack>
            {!questions.data.length && <Empty>{t("questionBank.noResults")}</Empty>}
        </>
    );
}

function QuestionExercise({ questionId, onDone }) {
    const { t } = useTranslation();
    const question = useQuery(
        "SELECT qo.id occurrence_id, qo.occurrence_key, q.id question_id, q.type, q.statement, q.explanation, q.difficulty, qo.number, qo.source_page, e.year, e.name edition_name, st.name stage_name, ap.name process_name, s.name subject, ak.answer_value correct_answer, ak.is_automatically_gradable FROM question_occurrences qo JOIN questions q ON q.id = qo.question_id JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id LEFT JOIN subjects s ON s.id = qo.subject_id LEFT JOIN answer_keys ak ON ak.question_occurrence_id = qo.id AND ak.question_part_id IS NULL WHERE qo.id = ?",
        [Number(questionId)],
        [questionId],
    );
    const current = question.data[0];
    const options = useQuery(
        "SELECT * FROM question_options WHERE question_id = ? ORDER BY position",
        [current?.question_id ?? 0],
        [current?.question_id],
    );
    const parts = useQuery(
        "SELECT * FROM question_parts WHERE question_id = ? ORDER BY position",
        [current?.question_id ?? 0],
        [current?.question_id],
    );
    const topicIds = useQuery(
        "SELECT curriculum_topic_id topic_id FROM question_topics WHERE question_occurrence_id = ?",
        [Number(questionId)],
        [questionId],
    );
    const related = useQuery(
        "SELECT DISTINCT qo2.id, qo2.number, e2.year, ap2.name process_name FROM question_topics qt1 JOIN question_topics qt2 ON qt2.curriculum_topic_id = qt1.curriculum_topic_id JOIN question_occurrences qo2 ON qo2.id = qt2.question_occurrence_id JOIN papers p2 ON p2.id = qo2.paper_id JOIN stages st2 ON st2.id = p2.stage_id JOIN editions e2 ON e2.id = st2.edition_id JOIN admission_processes ap2 ON ap2.id = e2.admission_process_id WHERE qt1.question_occurrence_id = ? AND qo2.id <> ? LIMIT 4",
        [Number(questionId), Number(questionId)],
        [questionId],
    );
    const [selected, setSelected] = useState("");
    const [result, setResult] = useState(null);
    const [diagnosis, setDiagnosis] = useState("");
    const [attemptId, setAttemptId] = useState(null);
    const [startedAt] = useState(Date.now());
    if (question.loading || options.loading || parts.loading || topicIds.loading || related.loading)
        return <Loading />;
    if (!current) return <Empty>{t("exercise.notFound")}</Empty>;
    const submit = async () => {
        const canGrade = Boolean(current.is_automatically_gradable);
        const isCorrect = canGrade
            ? selected.toUpperCase() === String(current.correct_answer || "").toUpperCase()
            : null;
        const topicList = topicIds.data.map((item) => item.topic_id);
        const contentKey = current.occurrence_key || `question:${current.occurrence_id}`;
        const attempt = await saveAttempt({
            contentKey,
            questionId: current.occurrence_id,
            selectedOption: selected,
            isCorrect,
            examYear: current.year,
            processSlug: current.process_name,
            subject: current.subject,
            topicIds: topicList,
            origin: "question",
            elapsedMs: Date.now() - startedAt,
            answeredAt: new Date().toISOString(),
        });
        setAttemptId(attempt.id);
        const suggested = suggestDiagnosis({
            isCorrect,
            elapsedMs: Date.now() - startedAt,
            attemptNumber: 1,
        });
        setDiagnosis(suggested);
        await saveDiagnosis({
            attemptId: attempt.id,
            code: suggested,
            confidence: "medium",
            suggestedBy: "heuristic",
            action: actionForDiagnosis(suggested),
        });
        const review = scheduleReview(
            { contentKey, targetType: "question", state: "new" },
            isCorrect === false ? "again" : "good",
        );
        await saveReviewTarget(contentKey, {
            ...review,
            questionId: current.occurrence_id,
            topicIds: topicList,
            reason: isCorrect === false ? "incorrect" : "practice",
        });
        await saveReviewItem(contentKey, {
            questionId: current.occurrence_id,
            contentKey,
            topicIds: topicList,
            reason: isCorrect === false ? "incorrect" : "practice",
            pending: isCorrect === false,
        });
        await recordStudyActivity({ type: "question" });
        await addStudyPoints(5, "question-answered");
        setResult(isCorrect);
        onDone?.();
    };
    const updateDiagnosis = async (value) => {
        setDiagnosis(value);
        if (attemptId)
            await saveDiagnosis({
                attemptId,
                code: value,
                confidence: "high",
                suggestedBy: "student",
                action: actionForDiagnosis(value),
            });
    };
    const diagnosisOptions = [
        ["concept_gap", t("exercise.diagnosis.conceptGap")],
        ["procedural_gap", t("exercise.diagnosis.proceduralGap")],
        ["interpretation_gap", t("exercise.diagnosis.interpretationGap")],
        ["strategy_gap", t("exercise.diagnosis.strategyGap")],
        ["inattention", t("exercise.diagnosis.inattention")],
        ["forgetting", t("exercise.diagnosis.forgetting")],
        ["correct_with_doubt", t("exercise.diagnosis.correctWithDoubt")],
        ["correct_by_guess", t("exercise.diagnosis.correctByGuess")],
        ["correct_confident", t("exercise.diagnosis.correctConfident")],
    ];
    let resultLabel = "";
    if (result) resultLabel = t("exercise.correct");
    else if (current.is_automatically_gradable) {
        resultLabel = t("exercise.answerKey", {
            answer: current.correct_answer,
        });
    } else {
        resultLabel = t("exercise.registeredForReview");
    }
    return (
        <>
            <PageTitle
                eyebrow={`${current.process_name} ${current.year} · ${current.stage_name}`}
                title={`Questão ${current.number}`}
                description={current.subject || current.edition_name}
            />
            <Card>
                <CardContent>
                    <Typography
                        sx={{
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.8,
                            fontSize: "1.1rem",
                        }}
                    >
                        {current.statement}
                    </Typography>
                    {parts.data.length > 0 && (
                        <Stack spacing={1} sx={{ mt: 2 }}>
                            {parts.data.map((part) => (
                                <Paper key={part.id} variant="outlined" sx={{ p: 1.5 }}>
                                    <Typography fontWeight={700}>
                                        {part.label || part.code}
                                    </Typography>
                                    <Typography>{part.prompt}</Typography>
                                </Paper>
                            ))}
                        </Stack>
                    )}
                    {options.data.length > 0 && (
                        <Stack spacing={1.5} sx={{ mt: 3 }}>
                            {options.data.map((option) => (
                                <Paper
                                    key={option.id}
                                    variant="outlined"
                                    onClick={() => result === null && setSelected(option.code)}
                                    sx={{
                                        p: 2,
                                        cursor: result === null ? "pointer" : "default",
                                        borderColor:
                                            selected === option.code ? "primary.main" : undefined,
                                        bgcolor:
                                            result === true &&
                                            option.code === current.correct_answer
                                                ? "#edf7f1"
                                                : undefined,
                                    }}
                                >
                                    <Typography>
                                        <strong>{option.code})</strong> {option.text}
                                    </Typography>
                                </Paper>
                            ))}
                        </Stack>
                    )}
                    {options.data.length === 0 && (
                        <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            label={t("exercise.answer")}
                            value={selected}
                            onChange={(event) => setSelected(event.target.value)}
                            disabled={result !== null}
                            sx={{ mt: 3 }}
                        />
                    )}
                    {parts.data.length > 0 && (
                        <Typography color="text.secondary" sx={{ mt: 2 }}>
                            {t("exercise.discursiveNotice")}
                        </Typography>
                    )}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mt: 3 }}
                    >
                        <Button
                            disabled={!selected || result !== null}
                            variant="contained"
                            onClick={submit}
                        >
                            {t("exercise.submit")}
                        </Button>
                        {result !== null && (
                            <Chip
                                icon={result ? <CheckCircleIcon /> : undefined}
                                color={result ? "success" : "info"}
                                label={resultLabel}
                            />
                        )}
                    </Stack>
                    {result !== null && (
                        <>
                            <Alert severity={result ? "success" : "info"} sx={{ mt: 3 }}>
                                <Typography fontWeight={700}>
                                    {t("exercise.explanation")}
                                </Typography>
                                <Typography sx={{ whiteSpace: "pre-wrap", mt: 1 }}>
                                    {current.explanation || t("exercise.noExplanation")}
                                </Typography>
                            </Alert>
                            <FormControl fullWidth sx={{ mt: 3 }}>
                                <InputLabel>{t("exercise.diagnosisLabel")}</InputLabel>
                                <Select
                                    value={diagnosis}
                                    label={t("exercise.diagnosisLabel")}
                                    onChange={(event) => updateDiagnosis(event.target.value)}
                                >
                                    {diagnosisOptions.map(([value, label]) => (
                                        <MenuItem key={value} value={value}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", mt: 1 }}
                            >
                                {t("exercise.diagnosisHint")}
                            </Typography>
                        </>
                    )}
                    {related.data.length > 0 && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {t("exercise.relatedQuestions")}
                            </Typography>
                            {related.data.map((item) => (
                                <Paper
                                    key={item.id}
                                    variant="outlined"
                                    sx={{
                                        p: 1.5,
                                        mb: 1,
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography variant="body2">
                                        {item.process_name} {item.year} · questão {item.number}
                                    </Typography>
                                    <Button
                                        component={Link}
                                        to={`/questoes/${item.id}`}
                                        size="small"
                                    >
                                        {t("exercise.open")}
                                    </Button>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
export function LegacyQuestionPage() {
    const { questionId } = useParams();
    return <QuestionExercise questionId={questionId} />;
}

function AssessmentSetPage() {
    const { t } = useTranslation();
    const { assessmentSetId } = useParams();
    const assessment = useQuery(
        "SELECT a.*, ap.name process_name, e.year FROM assessment_sets a LEFT JOIN admission_processes ap ON ap.id = a.admission_process_id LEFT JOIN editions e ON e.id = a.edition_id WHERE a.id = ?",
        [Number(assessmentSetId)],
        [assessmentSetId],
    );
    const items = useQuery(
        "SELECT asi.position, asi.points, qo.id occurrence_id, qo.occurrence_key, qo.number, q.type, q.difficulty, e.year, ap.name process_name, s.name subject, st.name stage_name FROM assessment_set_items asi JOIN question_occurrences qo ON qo.id = asi.question_occurrence_id JOIN questions q ON q.id = qo.question_id JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id LEFT JOIN subjects s ON s.id = qo.subject_id WHERE asi.assessment_set_id = ? ORDER BY asi.position",
        [Number(assessmentSetId)],
        [assessmentSetId],
    );
    const current = assessment.data[0];
    if (assessment.loading || items.loading) return <Loading />;
    if (!current) return <Empty>{t("assessment.notFound")}</Empty>;
    return (
        <>
            <PageTitle
                eyebrow="Prática e avaliações"
                title={current.title}
                description={current.description}
                action={
                    <Chip
                        icon={<AccessTimeIcon />}
                        label={`${items.data.length} questões · ${minutesLabel(current.duration_minutes)}`}
                        color="secondary"
                    />
                }
            />
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: { xs: 2, md: 3 } }}>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Questões da lista
                        </Typography>
                        <Stack spacing={1.5}>
                            {items.data.map((item) => (
                                <Paper
                                    key={item.occurrence_id}
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Box>
                                        <Typography fontWeight={700}>
                                            {item.position}. {item.process_name} {item.year} ·
                                            questão {item.number}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.stage_name} · {item.subject || "Prova geral"} ·{" "}
                                            {item.type}
                                        </Typography>
                                    </Box>
                                    <Button
                                        component={Link}
                                        to={`/questoes/${item.occurrence_id}`}
                                        endIcon={<ArrowForwardIcon />}
                                    >
                                        {t("common.solve")}
                                    </Button>
                                </Paper>
                            ))}
                        </Stack>
                        {!items.data.length && <Empty>{t("assessment.empty")}</Empty>}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6">{t("assessment.howToStudy")}</Typography>
                            <Typography sx={{ mt: 1, opacity: 0.88 }}>
                                {t("assessment.emptyDescription")}
                            </Typography>
                            <Button
                                component={Link}
                                to="/meu-estudo"
                                variant="contained"
                                color="secondary"
                                sx={{ mt: 2 }}
                            >
                                {t("assessment.followPerformance")}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

function SimulatorSetup() {
    const { t } = useTranslation();
    const { db } = useContent();
    const navigate = useNavigate();
    const [processSlug, setProcessSlug] = useState("");
    const [year, setYear] = useState("");
    const [amount, setAmount] = useState(10);
    const [loading, setLoading] = useState(false);
    const processes = useQuery(
        "SELECT slug, name FROM admission_processes WHERE is_published = 1 ORDER BY name",
    );
    const years = useQuery(
        "SELECT DISTINCT year FROM editions WHERE is_published = 1 ORDER BY year DESC",
    );
    const start = async () => {
        setLoading(true);
        const filters = ["q.status = 'published'"];
        const params = [];
        if (processSlug) {
            filters.push("ap.slug = ?");
            params.push(processSlug);
        }
        if (year) {
            filters.push("e.year = ?");
            params.push(Number(year));
        }
        const rows = db.query(
            `SELECT qo.id FROM question_occurrences qo JOIN questions q ON q.id = qo.question_id JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id WHERE ${filters.join(" AND ")} ORDER BY RANDOM() LIMIT ?`,
            [...params, Number(amount)],
        );
        const id = crypto.randomUUID();
        const selectedProcess = processes.data.find((item) => item.slug === processSlug);
        await saveSession({
            id,
            title: `${selectedProcess?.name || t("common.all")}${year ? ` ${year}` : ""}`,
            questionIds: rows.map((row) => row.id),
            startedAt: new Date().toISOString(),
            completedAt: null,
        });
        setLoading(false);
        navigate(`/simulado/${id}`);
    };
    if (processes.loading || years.loading) return <Loading />;
    return (
        <>
            <PageTitle
                eyebrow={t("simulator.eyebrow")}
                title={t("simulator.title")}
                description={t("simulator.description")}
            />
            <Card sx={{ maxWidth: 680 }}>
                <CardContent>
                    <Stack spacing={3}>
                        <FormControl fullWidth>
                            <InputLabel>{t("common.selectionProcess")}</InputLabel>
                            <Select
                                value={processSlug}
                                label={t("common.selectionProcess")}
                                onChange={(e) => setProcessSlug(e.target.value)}
                            >
                                <MenuItem value="">{t("common.all")}</MenuItem>
                                {processes.data.map((item) => (
                                    <MenuItem key={item.slug} value={item.slug}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>{t("common.year")}</InputLabel>
                            <Select
                                value={year}
                                label={t("common.year")}
                                onChange={(e) => setYear(e.target.value)}
                            >
                                <MenuItem value="">{t("common.all")}</MenuItem>
                                {years.data.map((item) => (
                                    <MenuItem key={item.year} value={item.year}>
                                        {item.year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>{t("simulator.quantity")}</InputLabel>
                            <Select
                                value={amount}
                                label={t("simulator.quantity")}
                                onChange={(e) => setAmount(e.target.value)}
                            >
                                {[5, 10, 20, 30].map((item) => (
                                    <MenuItem key={item} value={item}>
                                        {item} {t("common.questions")}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" size="large" onClick={start} disabled={loading}>
                            {loading ? t("simulator.preparing") : t("simulator.start")}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
}

function SimulatorRunner() {
    const { t } = useTranslation();
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [localSession, setLocalSession] = useState(null);
    const [index, setIndex] = useState(0);
    const [answer, setAnswer] = useState(null);
    useEffect(() => {
        getSession(sessionId).then(setLocalSession);
    }, [sessionId]);
    const ids = localSession?.questionIds || [];
    const questions = useQuery(
        ids.length
            ? `SELECT qo.id occurrence_id, qo.occurrence_key, q.id question_id, q.type, q.statement, q.explanation, e.year, ap.name process_name, s.name subject, ak.answer_value correct_answer, ak.is_automatically_gradable FROM question_occurrences qo JOIN questions q ON q.id = qo.question_id JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id LEFT JOIN subjects s ON s.id = qo.subject_id LEFT JOIN answer_keys ak ON ak.question_occurrence_id = qo.id AND ak.question_part_id IS NULL WHERE qo.id IN (${ids.map(() => "?").join(",")}) ORDER BY CASE qo.id ${ids.map((id, i) => `WHEN ${id} THEN ${i}`).join(" ")} END`
            : "SELECT * FROM questions WHERE 1 = 0",
        ids,
        [ids.join(",")],
    );
    const current = questions.data[index];
    const options = useQuery(
        "SELECT * FROM question_options WHERE question_id = ? ORDER BY position",
        [current?.question_id || 0],
        [current?.question_id],
    );
    const topics = useQuery(
        "SELECT curriculum_topic_id topic_id FROM question_topics WHERE question_occurrence_id = ?",
        [current?.occurrence_id || 0],
        [current?.occurrence_id],
    );
    if (!localSession || questions.loading || options.loading || topics.loading) return <Loading />;
    if (!ids.length || !current) return <Empty>{t("simulator.notEnough")}</Empty>;
    const next = async () => {
        if (!answer) return;
        const auto = Boolean(current.is_automatically_gradable);
        const isCorrect = auto
            ? answer.toUpperCase() === String(current.correct_answer || "").toUpperCase()
            : null;
        const topicList = topics.data.map((item) => item.topic_id);
        await saveAttempt({
            contentKey: current.occurrence_key || `question:${current.occurrence_id}`,
            questionId: current.occurrence_id,
            selectedOption: answer,
            isCorrect,
            examYear: current.year,
            processSlug: current.process_name,
            subject: current.subject,
            topicIds: topicList,
            sessionId,
            origin: "simulator",
            answeredAt: new Date().toISOString(),
        });
        if (isCorrect === false)
            await saveReviewItem(`review:${current.occurrence_key || current.occurrence_id}`, {
                questionId: current.occurrence_id,
                contentKey: current.occurrence_key || `question:${current.occurrence_id}`,
                topicIds: topicList,
                reason: "incorrect",
                pending: true,
            });
        await recordStudyActivity({ type: "simulator-question" });
        await addStudyPoints(5, "simulator-question");
        if (index + 1 >= questions.data.length) {
            await saveSession({
                ...localSession,
                completedAt: new Date().toISOString(),
            });
            await addStudyPoints(15, "simulator-completed");
            navigate(`/simulado/${sessionId}/resultado`);
        } else {
            setIndex(index + 1);
            setAnswer(null);
        }
    };
    return (
        <>
            <PageTitle
                eyebrow={`Simulado · ${index + 1}/${questions.data.length}`}
                title={localSession.title}
            />
            <Card>
                <CardContent>
                    <Typography
                        sx={{
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.8,
                            fontSize: "1.1rem",
                        }}
                    >
                        {current.statement}
                    </Typography>
                    <Stack spacing={1.5} sx={{ mt: 3 }}>
                        {options.data.map((option) => (
                            <Paper
                                key={option.id}
                                variant="outlined"
                                onClick={() => setAnswer(option.code)}
                                sx={{
                                    p: 2,
                                    cursor: "pointer",
                                    borderColor:
                                        answer === option.code ? "primary.main" : undefined,
                                }}
                            >
                                <Typography>
                                    <strong>{option.code})</strong> {option.text}
                                </Typography>
                            </Paper>
                        ))}
                    </Stack>
                    {!options.data.length && (
                        <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            label={t("exercise.answer")}
                            value={answer || ""}
                            onChange={(event) => setAnswer(event.target.value)}
                            sx={{ mt: 3 }}
                        />
                    )}
                    <Button variant="contained" sx={{ mt: 3 }} disabled={!answer} onClick={next}>
                        {index + 1 === questions.data.length
                            ? t("simulator.finish")
                            : t("simulator.next")}
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}
function SimulatorResult() {
    const { t } = useTranslation();
    const { sessionId } = useParams();
    const [attempts, setAttempts] = useState(null);
    useEffect(() => {
        listAttempts().then((items) =>
            setAttempts(items.filter((item) => item.sessionId === sessionId)),
        );
    }, [sessionId]);
    if (!attempts) return <Loading />;
    const graded = attempts.filter((item) => item.isCorrect !== null);
    const correct = graded.filter((item) => item.isCorrect).length;
    return (
        <>
            <PageTitle
                eyebrow={t("simulator.result")}
                title={t("simulator.completed")}
                description={t("simulator.savedResult")}
            />
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                    <StatCard
                        value={`${correct}/${graded.length}`}
                        label={t("simulator.corrected")}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard
                        value={`${graded.length ? Math.round((correct / graded.length) * 100) : 0}%`}
                        label={t("simulator.utilization")}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard
                        value={attempts.length - graded.length}
                        label={t("simulator.discursive")}
                    />
                </Grid>
            </Grid>
            <Button component={Link} to="/simulado" variant="contained">
                {t("simulator.new")}
            </Button>
        </>
    );
}

function PerformanceDashboard() {
    const { t } = useTranslation();
    const [attempts, setAttempts] = useState(null);
    const topics = useQuery("SELECT ct.id, ct.label name FROM curriculum_topics ct");
    useEffect(() => {
        listAttempts().then(setAttempts);
    }, []);
    if (topics.loading || !attempts) return <Loading />;
    const graded = attempts.filter((item) => item.isCorrect !== null);
    const total = graded.length;
    const correct = graded.filter((item) => item.isCorrect).length;
    const grouped = Object.entries(
        graded.reduce((acc, item) => {
            acc[item.subject || "Sem disciplina"] ||= { total: 0, correct: 0 };
            acc[item.subject || "Sem disciplina"].total += 1;
            acc[item.subject || "Sem disciplina"].correct += item.isCorrect ? 1 : 0;
            return acc;
        }, {}),
    );
    const topicMap = new Map(topics.data.map((topic) => [topic.id, topic]));
    const byTopic = Object.entries(
        graded
            .flatMap((item) =>
                (item.topicIds || []).map((id) => ({
                    ...item,
                    topicId: Number(id),
                })),
            )
            .reduce((acc, item) => {
                const topic = topicMap.get(item.topicId);
                if (!topic) return acc;
                acc[topic.id] ||= { name: topic.name, total: 0, correct: 0 };
                acc[topic.id].total += 1;
                acc[topic.id].correct += item.isCorrect ? 1 : 0;
                return acc;
            }, {}),
    );
    return (
        <>
            <PageTitle
                eyebrow={t("performance.eyebrow")}
                title={t("performance.title")}
                description={t("performance.description")}
                action={
                    <Button
                        color="error"
                        onClick={async () => {
                            await clearProgress();
                            setAttempts([]);
                        }}
                    >
                        {t("performance.clear")}
                    </Button>
                }
            />
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <StatCard value={attempts.length} label={t("performance.attempts")} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard value={correct} label="acertos" />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard
                        value={`${total ? Math.round((correct / total) * 100) : 0}%`}
                        label={t("performance.correctedUtilization")}
                    />
                </Grid>
            </Grid>
            <Typography variant="h5" sx={{ mb: 2 }}>
                {t("performance.byProcess")}
            </Typography>
            <Stack spacing={1.5}>
                {grouped.map(([name, value]) => (
                    <Paper
                        key={name}
                        variant="outlined"
                        sx={{
                            p: 2,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography fontWeight={700}>{name}</Typography>
                        <Typography>
                            {value.correct}/{value.total} ·{" "}
                            {Math.round((value.correct / value.total) * 100)}%
                        </Typography>
                    </Paper>
                ))}
            </Stack>
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                {t("performance.byTopic")}
            </Typography>
            <Stack spacing={1.5}>
                {byTopic.map(([id, value]) => (
                    <Paper
                        key={id}
                        variant="outlined"
                        sx={{
                            p: 2,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography fontWeight={700}>{value.name}</Typography>
                        <Typography>
                            {value.correct}/{value.total} ·{" "}
                            {Math.round((value.correct / value.total) * 100)}%
                        </Typography>
                    </Paper>
                ))}
            </Stack>
            {!attempts.length && <Empty>{t("performance.empty")}</Empty>}
        </>
    );
}
function ReviewQueue() {
    const { t } = useTranslation();
    const [attempts, setAttempts] = useState(null);
    const [targets, setTargets] = useState([]);
    const questions = useQuery(
        "SELECT qo.id, qo.occurrence_key, qo.number, e.year, ap.name process_name, s.name subject FROM question_occurrences qo JOIN questions q ON q.id = qo.question_id JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id LEFT JOIN subjects s ON s.id = qo.subject_id WHERE q.status = 'published'",
    );
    const reload = useCallback(
        () =>
            Promise.all([listAttempts(), listReviewTargets()]).then(([items, reviewItems]) => {
                setAttempts(items);
                setTargets(reviewItems);
            }),
        [],
    );
    useEffect(() => {
        reload();
    }, [reload]);
    if (questions.loading || !attempts) return <Loading />;
    const wrongIds = new Set(
        attempts.filter((item) => item.isCorrect === false).map((item) => Number(item.questionId)),
    );
    const wrong = questions.data.filter((item) => wrongIds.has(item.id));
    const targetByKey = new Map(targets.map((item) => [item.contentKey, item]));
    const postpone = async (question) => {
        const key = question.occurrence_key || `question:${question.id}`;
        await saveReviewTarget(key, {
            ...(targetByKey.get(key) || {}),
            contentKey: key,
            dueAt: new Date(Date.now() + 86400000).toISOString(),
            suspended: false,
        });
        await reload();
    };
    const suspend = async (question) => {
        const key = question.occurrence_key || `question:${question.id}`;
        await saveReviewTarget(key, {
            ...(targetByKey.get(key) || {}),
            contentKey: key,
            suspended: true,
        });
        await reload();
    };
    return (
        <>
            <PageTitle
                eyebrow={t("review.eyebrow")}
                title={t("review.title")}
                description={t("review.description")}
            />
            {wrong.map((question) => {
                const target = targetByKey.get(question.occurrence_key);
                const due = !target?.dueAt || new Date(target.dueAt) <= new Date();
                let reviewColor = "text.secondary";
                if (target?.suspended) reviewColor = "warning.main";
                else if (due) reviewColor = "error.main";
                let reviewLabel = t("review.nextReview", {
                    date: new Date(target?.dueAt || Date.now()).toLocaleDateString("pt-BR"),
                });
                if (target?.suspended) reviewLabel = t("review.suspended");
                else if (due) reviewLabel = t("review.availableNow");
                return (
                    <Paper key={question.id} variant="outlined" sx={{ p: 2, mb: 1.5 }}>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            justifyContent="space-between"
                            gap={2}
                            alignItems={{ md: "center" }}
                        >
                            <Box>
                                <Typography fontWeight={700}>
                                    {question.process_name} {question.year} · questão{" "}
                                    {question.number} · {question.subject || "Prova geral"}
                                </Typography>
                                <Typography variant="body2" color={reviewColor} sx={{ mt: 0.5 }}>
                                    {reviewLabel}
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    component={Link}
                                    to={`/questoes/${question.id}`}
                                    variant="contained"
                                >
                                    {t("review.review")}
                                </Button>
                                <Button onClick={() => postpone(question)} size="small">
                                    {t("review.postpone")}
                                </Button>
                                <Button
                                    onClick={() => suspend(question)}
                                    size="small"
                                    color="warning"
                                >
                                    {t("review.suspend")}
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>
                );
            })}
            {!wrong.length && <Empty>{t("review.empty")}</Empty>}
        </>
    );
}

function minutesLabel(value) {
    return value ? `${value} min` : "Conteúdo guiado";
}
function CatalogCard({ icon, eyebrow, title, description, meta, to, color = "primary" }) {
    return (
        <Card sx={{ height: "100%", position: "relative", overflow: "visible" }}>
            <CardActionArea component={Link} to={to} sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        gap={2}
                    >
                        <Box sx={{ color: `${color}.main`, display: "flex" }}>{icon}</Box>
                        <Chip label={eyebrow} size="small" variant="outlined" />
                    </Stack>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, minHeight: 42 }}
                    >
                        {description}
                    </Typography>
                    {meta && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 2 }}
                        >
                            {meta}
                        </Typography>
                    )}
                    <Button size="small" endIcon={<ArrowForwardIcon />} sx={{ mt: 1, px: 0 }}>
                        Abrir
                    </Button>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export function LegacyCatalogPage() {
    const [tab, setTab] = useState(0);
    const [search, setSearch] = useState("");
    const courses = useQuery(
        "SELECT c.*, COUNT(DISTINCT m.id) module_count, COALESCE(SUM(i.duration_minutes), 0) total_minutes FROM learning_courses c LEFT JOIN learning_course_modules m ON m.learning_course_id = c.id LEFT JOIN learning_course_items i ON i.module_id = m.id WHERE c.is_published = 1 GROUP BY c.id ORDER BY c.course_type, c.title",
    );
    const maps = useQuery(
        "SELECT m.*, e.year, ap.name process_name, c.title course_title, COUNT(DISTINCT mt.curriculum_topic_id) topic_count FROM learning_maps m LEFT JOIN editions e ON e.id = m.edition_id LEFT JOIN admission_processes ap ON ap.id = m.admission_process_id LEFT JOIN learning_courses c ON c.id = m.learning_course_id LEFT JOIN learning_map_topics mt ON mt.map_id = m.id WHERE m.is_published = 1 GROUP BY m.id ORDER BY m.title",
    );
    const plans = useQuery(
        "SELECT p.*, e.year, c.title course_title, COUNT(s.id) step_count FROM study_plans p LEFT JOIN editions e ON e.id = p.edition_id LEFT JOIN learning_courses c ON c.id = p.learning_course_id LEFT JOIN study_plan_steps s ON s.study_plan_id = p.id WHERE p.is_published = 1 GROUP BY p.id ORDER BY p.title",
    );
    const lessons = useQuery(
        "SELECT id, title, intro description FROM lessons WHERE is_published = 1 ORDER BY title",
    );
    const resources = useQuery(
        "SELECT id, title, description, provider, url FROM resources WHERE is_published = 1 ORDER BY title",
    );
    const questions = useQuery(
        "SELECT qo.id, 'Questão' type, 'Questão de prova' description, e.year, ap.name process_name, qo.number FROM question_occurrences qo JOIN questions q ON q.id = qo.question_id JOIN papers p ON p.id = qo.paper_id JOIN stages st ON st.id = p.stage_id JOIN editions e ON e.id = st.edition_id JOIN admission_processes ap ON ap.id = e.admission_process_id WHERE q.status = 'published' ORDER BY e.year DESC, qo.number LIMIT 40",
    );
    if (
        courses.loading ||
        maps.loading ||
        plans.loading ||
        lessons.loading ||
        resources.loading ||
        questions.loading
    )
        return <Loading />;
    const matcher = (item) =>
        `${item.title} ${item.description || ""}`
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase());
    const contentItems = [
        ...lessons.data.map((item) => ({
            ...item,
            type: "Lição",
            icon: <AutoStoriesIcon />,
            to: `/licoes/${item.id}`,
            meta: "Teoria consolidada",
        })),
        ...resources.data.map((item) => ({
            ...item,
            type: "Material",
            icon: <ExploreIcon />,
            href: item.url,
            meta: item.provider,
        })),
        ...questions.data.map((item) => ({
            ...item,
            title: `${item.process_name} ${item.year} · questão ${item.number}`,
            type: item.type,
            icon: <QuizIcon />,
            to: `/questoes/${item.id}`,
            meta: "Prática de prova",
        })),
    ].filter(matcher);
    const sections = [
        courses.data.filter(matcher).map((item) => (
            <Grid item xs={12} md={6} key={`course-${item.id}`}>
                <CatalogCard
                    icon={<SchoolIcon />}
                    eyebrow={
                        item.course_type === "specific" ? "Preparação específica" : "Curso geral"
                    }
                    title={item.title}
                    description={item.description}
                    meta={`${item.module_count} módulos · ${minutesLabel(item.total_minutes)}`}
                    to={`/cursos/${item.slug}`}
                />
            </Grid>
        )),
        maps.data.filter(matcher).map((item) => (
            <Grid item xs={12} md={6} key={`map-${item.id}`}>
                <CatalogCard
                    icon={<MapIcon />}
                    eyebrow="Mapa de conhecimento"
                    title={item.title}
                    description={item.description}
                    meta={`${item.topic_count} tópicos · ${item.process_name || "Multi-exame"}`}
                    to={`/mapa/${item.slug}`}
                    color="secondary"
                />
            </Grid>
        )),
        plans.data.filter(matcher).map((item) => (
            <Grid item xs={12} md={6} key={`plan-${item.id}`}>
                <CatalogCard
                    icon={<EventNoteIcon />}
                    eyebrow="Plano de estudo"
                    title={item.title}
                    description={item.description}
                    meta={`${item.duration_days || "Flexível"} dias · ${item.step_count} etapas`}
                    to={`/plano/${item.slug}`}
                    color="success"
                />
            </Grid>
        )),
        contentItems.map((item) => (
            <Grid item xs={12} md={6} key={`${item.type}-${item.id}`}>
                <Card>
                    <CardActionArea
                        component={item.href ? "a" : Link}
                        href={item.href}
                        target={item.href ? "_blank" : undefined}
                        rel={item.href ? "noreferrer" : undefined}
                        to={item.to}
                    >
                        <CardContent sx={{ p: 2.5 }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Box
                                    sx={{
                                        color: "primary.main",
                                        display: "flex",
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Chip label={item.type} size="small" variant="outlined" />
                                    <Typography variant="h6" sx={{ mt: 1 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.description}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {item.meta}
                                    </Typography>
                                </Box>
                                <ArrowForwardIcon color="action" />
                            </Stack>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        )),
    ];
    return (
        <>
            <PageTitle
                eyebrow="Catálogo de aprendizagem"
                title="O que você quer estudar hoje?"
                description="Escolha uma trilha, consulte o mapa de tópicos ou comece um plano. Todo o conteúdo já está disponível offline."
            />
            <TextField
                fullWidth
                placeholder="Encontrar curso, mapa, plano ou conteúdo"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                sx={{ mb: 3, maxWidth: 720 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <Tabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                sx={{ mb: 3 }}
                variant="scrollable"
            >
                <Tab label={`Cursos ${courses.data.length}`} />
                <Tab label={`Mapas ${maps.data.length}`} />
                <Tab label={`Planos ${plans.data.length}`} />
                <Tab label={`Conteúdos ${contentItems.length}`} />
            </Tabs>
            <Grid container spacing={2}>
                {sections[tab].length ? (
                    sections[tab]
                ) : (
                    <Grid item xs={12}>
                        <Empty>Nenhum conteúdo encontrado para esta busca.</Empty>
                    </Grid>
                )}
            </Grid>
        </>
    );
}

export function LegacyCourseOverview() {
    const { slug } = useParams();
    const course = useQuery(
        "SELECT c.*, COUNT(DISTINCT m.id) module_count, COALESCE(SUM(i.duration_minutes), 0) total_minutes FROM learning_courses c LEFT JOIN learning_course_modules m ON m.learning_course_id = c.id LEFT JOIN learning_course_items i ON i.module_id = m.id WHERE c.slug = ? GROUP BY c.id",
        [slug],
        [slug],
    );
    const current = course.data[0];
    const modules = useQuery(
        "SELECT m.*, COUNT(i.id) item_count FROM learning_course_modules m LEFT JOIN learning_course_items i ON i.module_id = m.id WHERE m.learning_course_id = ? GROUP BY m.id ORDER BY m.position",
        [current?.id || 0],
        [current?.id],
    );
    const items = useQuery(
        "SELECT i.*, l.slug lesson_slug FROM learning_course_items i LEFT JOIN lessons l ON l.id = i.lesson_id JOIN learning_course_modules m ON m.id = i.module_id WHERE m.learning_course_id = ? ORDER BY m.position, i.position",
        [current?.id || 0],
        [current?.id],
    );
    const [enrolled, setEnrolled] = useState(false);
    const [progress, setProgress] = useState([]);
    useEffect(() => {
        if (!current) return;
        Promise.all([listEnrollments(), listLessonProgress()]).then(([enrollments, lessons]) => {
            setEnrolled(enrollments.some((item) => item.contentKey === `course:${current.id}`));
            setProgress(lessons);
        });
    }, [current?.id, current]);
    if (course.loading || modules.loading || items.loading) return <Loading />;
    if (!current) return <Empty>Curso não encontrado.</Empty>;
    const completed = progress.filter((item) =>
        items.data.some((courseItem) => courseItem.lesson_id === item.lessonId && item.completed),
    ).length;
    const percent = items.data.length ? Math.round((completed / items.data.length) * 100) : 0;
    const start = async () => {
        await enrollCourse(`course:${current.id}`, {
            courseId: current.id,
            slug: current.slug,
            title: current.title,
        });
        setEnrolled(true);
    };
    return (
        <>
            <Paper
                sx={{
                    p: { xs: 3, md: 5 },
                    mb: 4,
                    color: "white",
                    background: "linear-gradient(120deg, #121b35 0%, #273b72 65%, #523a8b 100%)",
                }}
            >
                <Chip
                    label={
                        current.course_type === "specific" ? "Preparação específica" : "Curso geral"
                    }
                    sx={{ color: "white", borderColor: "rgba(255,255,255,.4)" }}
                    variant="outlined"
                />
                <Typography variant="h2" sx={{ mt: 2, maxWidth: 760 }}>
                    {current.title}
                </Typography>
                <Typography sx={{ mt: 2, maxWidth: 700, opacity: 0.86 }}>
                    {current.description}
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mt: 3 }}>
                    <Typography>
                        <strong>{current.module_count}</strong> módulos
                    </Typography>
                    <Typography>
                        <strong>{minutesLabel(current.total_minutes)}</strong>
                    </Typography>
                    <Typography>
                        <strong>{percent}%</strong> concluído
                    </Typography>
                </Stack>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={enrolled ? <CheckCircleIcon /> : <PlayArrowIcon />}
                    onClick={start}
                    sx={{ mt: 3 }}
                >
                    {enrolled ? "Continuar curso" : "Começar curso"}
                </Button>
            </Paper>
            <PageTitle
                eyebrow="Programa do curso"
                title="Aprenda em sequência"
                description="Cada módulo combina teoria, exercícios e revisões curtas. Você pode pular uma etapa e voltar depois."
            />
            <Stack spacing={2}>
                {modules.data.map((module) => (
                    <Card key={module.id}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 2.5, bgcolor: "background.default" }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Box>
                                        <Typography variant="h6">
                                            {module.position}. {module.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 0.5 }}
                                        >
                                            {module.description}
                                        </Typography>
                                    </Box>
                                    <Chip label={`${module.item_count} etapas`} size="small" />
                                </Stack>
                            </Box>
                            <List disablePadding>
                                {items.data
                                    .filter((item) => item.module_id === module.id)
                                    .map((item, index) => {
                                        let itemAction = null;
                                        if (item.lesson_slug) {
                                            itemAction = (
                                                <Button
                                                    component={Link}
                                                    to={`/licoes/${item.lesson_id}`}
                                                    endIcon={<ArrowForwardIcon />}
                                                >
                                                    Estudar
                                                </Button>
                                            );
                                        } else if (item.assessment_set_id) {
                                            itemAction = (
                                                <Button
                                                    component={Link}
                                                    to={`/listas/${item.assessment_set_id}`}
                                                    endIcon={<ArrowForwardIcon />}
                                                >
                                                    Praticar
                                                </Button>
                                            );
                                        } else {
                                            itemAction = (
                                                <Chip
                                                    label={
                                                        item.item_type === "practice"
                                                            ? "Prática"
                                                            : "Revisão"
                                                    }
                                                    size="small"
                                                />
                                            );
                                        }
                                        return (
                                            <ListItem
                                                key={item.id}
                                                divider={
                                                    index <
                                                    items.data.filter(
                                                        (entry) => entry.module_id === module.id,
                                                    ).length -
                                                        1
                                                }
                                                secondaryAction={itemAction}
                                            >
                                                <ListItemText
                                                    primary={item.title}
                                                    secondary={
                                                        <>
                                                            {item.description} ·{" "}
                                                            {minutesLabel(item.duration_minutes)}
                                                        </>
                                                    }
                                                    sx={{ ml: 1 }}
                                                />
                                            </ListItem>
                                        );
                                    })}
                            </List>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </>
    );
}

export function LegacyLessonStudy() {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const lesson = useQuery(
        "SELECT * FROM lessons WHERE id = ? AND is_published = 1",
        [Number(lessonId)],
        [lessonId],
    );
    const sections = useQuery(
        "SELECT * FROM lesson_sections WHERE lesson_id = ? ORDER BY position",
        [Number(lessonId)],
        [lessonId],
    );
    const [completed, setCompleted] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    useEffect(() => {
        Promise.all([listLessonProgress(), listBookmarks()]).then(([progress, bookmarks]) => {
            setCompleted(
                progress.some(
                    (item) =>
                        (item.contentKey === `lesson:${lessonId}` ||
                            item.lessonId === Number(lessonId)) &&
                        item.completed,
                ),
            );
            setBookmarked(
                bookmarks.some(
                    (item) =>
                        item.contentKey === `lesson:${lessonId}` ||
                        item.lessonId === Number(lessonId),
                ),
            );
        });
    }, [lessonId]);
    if (lesson.loading || sections.loading) return <Loading />;
    const current = lesson.data[0];
    if (!current) return <Empty>Lição não encontrada.</Empty>;
    const toggleComplete = async () => {
        const next = !completed;
        await saveLessonProgress(`lesson:${current.slug}`, {
            lessonId: Number(lessonId),
            completed: next,
        });
        if (next && !completed) {
            await recordStudyActivity({ type: "lesson" });
            await addStudyPoints(10, "lesson-completed");
        }
        setCompleted(next);
    };
    const toggleBookmark = async () => {
        await saveBookmark(`lesson:${current.slug}`, {
            lessonId: Number(lessonId),
            title: current.title,
            type: "lesson",
        });
        setBookmarked(true);
    };
    const readTime =
        sections.data.reduce((sum, section) => sum + Number(section.read_time_minutes || 0), 0) ||
        3;
    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    Catálogo / Curso / Tópicos / {current.title}
                </Typography>
            </Box>
            <PageTitle
                eyebrow={`Lição · ${readTime} min de leitura`}
                title={current.title}
                description={current.intro}
                action={
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<BookmarkBorderIcon />}
                            onClick={toggleBookmark}
                        >
                            {bookmarked ? "Salva" : "Salvar"}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            onClick={toggleComplete}
                        >
                            {completed ? "Concluída" : "Marcar como concluída"}
                        </Button>
                    </Stack>
                }
            />
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper variant="outlined" sx={{ p: 2, position: { md: "sticky" }, top: 88 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Índice da lição
                        </Typography>
                        <List dense disablePadding>
                            {sections.data.map((section, index) => (
                                <ListItemButton
                                    key={section.id}
                                    component="a"
                                    href={`#section-${section.id}`}
                                >
                                    <ListItemText
                                        primary={`${index + 1}. ${section.title || "Conteúdo"}`}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Paper sx={{ p: { xs: 2, md: 5 } }}>
                        {sections.data.map((section) => (
                            <Box
                                id={`section-${section.id}`}
                                key={section.id}
                                sx={{ mb: 5, scrollMarginTop: 100 }}
                            >
                                <Typography variant="h4" sx={{ mb: 2 }}>
                                    {section.title || "Teoria"}
                                </Typography>
                                <ContentRenderer
                                    markdown={section.content}
                                    blocksJson={section.blocks_json}
                                    onQuestion={(questionId) => navigate(`/questoes/${questionId}`)}
                                />
                            </Box>
                        ))}
                        <Divider sx={{ my: 4 }} />
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                            <Button
                                component={Link}
                                to="/questoes"
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                            >
                                Ir para a prática
                            </Button>
                            <Button component={Link} to="/revisao" variant="outlined">
                                Ver revisões
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}

export function LegacyMapPage() {
    const { slug } = useParams();
    const mapSlug = slug || "";
    const map = useQuery(
        "SELECT m.*, e.year, ap.name process_name FROM learning_maps m LEFT JOIN editions e ON e.id = m.edition_id LEFT JOIN admission_processes ap ON ap.id = m.admission_process_id WHERE m.is_published = 1 AND (? = '' OR m.slug = ?) ORDER BY m.id LIMIT 1",
        [mapSlug, mapSlug],
        [mapSlug],
    );
    const current = map.data[0];
    const nodes = useQuery(
        "SELECT mt.*, ct.label, ct.description, t.slug, t.name canonical_name FROM learning_map_topics mt JOIN curriculum_topics ct ON ct.id = mt.curriculum_topic_id JOIN topics t ON t.id = ct.topic_id WHERE mt.map_id = ? ORDER BY mt.position",
        [current?.id || 0],
        [current?.id],
    );
    const edges = useQuery(
        "SELECT * FROM learning_map_edges WHERE map_id = ?",
        [current?.id || 0],
        [current?.id],
    );
    const [progress, setProgress] = useState([]);
    useEffect(() => {
        listLessonProgress().then(setProgress);
    }, []);
    if (map.loading || nodes.loading || edges.loading) return <Loading />;
    if (!current) return <Empty>Mapa não encontrado.</Empty>;
    return (
        <>
            <PageTitle
                eyebrow={`${current.process_name || "Multi-exame"} ${current.year || ""}`}
                title={current.title}
                description={current.description}
                action={
                    <Button
                        component={Link}
                        to="/plano"
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                    >
                        Ver plano de estudo
                    </Button>
                }
            />
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: { xs: 2, md: 4 } }}>
                        <Typography variant="h5" sx={{ mb: 3 }}>
                            Mapa de conhecimento
                        </Typography>
                        <Stepper orientation="vertical" activeStep={-1}>
                            {nodes.data.map((node, index) => {
                                const done = progress.some(
                                    (item) =>
                                        item.topicId === node.curriculum_topic_id && item.completed,
                                );
                                return (
                                    <Step key={node.curriculum_topic_id} completed={done}>
                                        <StepButton
                                            icon={
                                                done ? (
                                                    <CheckCircleIcon color="success" />
                                                ) : undefined
                                            }
                                            onClick={() => {}}
                                        >
                                            <Stack alignItems="flex-start">
                                                <Typography fontWeight={700}>
                                                    {node.label}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {node.description ||
                                                        "Estude a teoria e pratique questões deste tópico."}
                                                </Typography>
                                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                                    <Chip
                                                        size="small"
                                                        label={
                                                            node.is_milestone
                                                                ? "Marco"
                                                                : `Etapa ${index + 1}`
                                                        }
                                                    />
                                                    <Button
                                                        component={Link}
                                                        to={`/topicos/${node.slug}`}
                                                        size="small"
                                                        endIcon={<ArrowForwardIcon />}
                                                    >
                                                        Abrir tópico
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </StepButton>
                                    </Step>
                                );
                            })}
                        </Stepper>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Como usar o mapa</Typography>
                            <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
                                Comece pelos primeiros tópicos, avance pelos pré-requisitos e use as
                                questões para confirmar o domínio. Os marcos indicam pontos
                                importantes da trilha.
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2">
                                <strong>{nodes.data.length}</strong> tópicos no mapa
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>{edges.data.length}</strong> relações de pré-requisito
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

export function LegacyStudyPlanPage() {
    const { slug } = useParams();
    const plans = useQuery(
        "SELECT p.*, e.year, c.title course_title FROM study_plans p LEFT JOIN editions e ON e.id = p.edition_id LEFT JOIN learning_courses c ON c.id = p.learning_course_id WHERE p.is_published = 1 AND (? = '' OR p.slug = ?)",
        [slug || "", slug || ""],
        [slug],
    );
    const current = plans.data[0];
    const steps = useQuery(
        "SELECT s.*, ct.label topic_label FROM study_plan_steps s LEFT JOIN curriculum_topics ct ON ct.id = s.curriculum_topic_id WHERE s.study_plan_id = ? ORDER BY s.position",
        [current?.id || 0],
        [current?.id],
    );
    const [done, setDone] = useState([]);
    useEffect(() => {
        listPlanProgress().then((items) =>
            setDone(items.filter((item) => item.planId === current?.id)),
        );
    }, [current?.id]);
    if (plans.loading || steps.loading) return <Loading />;
    if (!current) return <Empty>Não há plano de estudo publicado.</Empty>;
    const toggle = async (step) => {
        const isDone = done.some((item) => item.stepId === step.id && item.completed);
        await savePlanProgress(`plan:${current.id}:step:${step.id}`, {
            planId: current.id,
            stepId: step.id,
            completed: !isDone,
        });
        setDone((items) =>
            isDone
                ? items.filter((item) => item.stepId !== step.id)
                : [...items, { planId: current.id, stepId: step.id, completed: true }],
        );
    };
    const completion = steps.data.length ? Math.round((done.length / steps.data.length) * 100) : 0;
    return (
        <>
            <PageTitle
                eyebrow={`${current.course_title || "Plano editorial"} · ${current.duration_days || "Flexível"} dias`}
                title={current.title}
                description={current.objective || current.description}
                action={
                    <Chip
                        icon={<AccessTimeIcon />}
                        label={`${completion}% concluído`}
                        color={completion === 100 ? "success" : "primary"}
                    />
                }
            />
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: { xs: 2, md: 4 } }}>
                        <Typography variant="h5" sx={{ mb: 3 }}>
                            Sua sequência de estudo
                        </Typography>
                        <Stack spacing={2}>
                            {steps.data.map((step) => {
                                const complete = done.some(
                                    (item) => item.stepId === step.id && item.completed,
                                );
                                return (
                                    <Paper
                                        key={step.id}
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            borderColor: complete ? "success.main" : undefined,
                                        }}
                                    >
                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                            <IconButton
                                                aria-label={
                                                    complete
                                                        ? t("lesson.completed")
                                                        : t("lesson.complete")
                                                }
                                                color={complete ? "success" : "default"}
                                                onClick={() => toggle(step)}
                                            >
                                                {complete ? <CheckCircleIcon /> : <EventNoteIcon />}
                                            </IconButton>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6">
                                                    {step.position}. {step.title}
                                                </Typography>
                                                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                                                    {step.description}
                                                </Typography>
                                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                                    <Chip
                                                        size="small"
                                                        label={step.topic_label || "Estudo guiado"}
                                                    />
                                                    <Chip
                                                        size="small"
                                                        icon={<AccessTimeIcon />}
                                                        label={minutesLabel(step.estimated_minutes)}
                                                    />
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                );
                            })}
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6">Ritmo recomendado</Typography>
                            <Typography sx={{ mt: 1, opacity: 0.85 }}>
                                Marque cada etapa quando terminar. Sua cópia do plano fica salva
                                apenas neste dispositivo e pode ser ajustada sem alterar o conteúdo
                                editorial.
                            </Typography>
                            <Button
                                component={Link}
                                to="/mapa"
                                variant="contained"
                                color="secondary"
                                sx={{ mt: 2 }}
                            >
                                Abrir mapa
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

function MyStudyPage() {
    const [state, setState] = useState(null);
    useEffect(() => {
        let active = true;
        const safe = (promise, fallback) => promise.catch(() => fallback);
        Promise.all([
            safe(listEnrollments(), []),
            safe(listPlanProgress(), []),
            safe(listLessonProgress(), []),
            safe(listBookmarks(), []),
            safe(listAttempts(), []),
            safe(getStreak(), null),
            safe(getSetting("studyPoints"), { value: 0 }),
        ]).then(async ([enrollments, plans, lessons, bookmarks, attempts, streak, points]) => {
            const stats = {
                attempts: attempts.length,
                lessons: lessons.filter((item) => item.completed).length,
                sessions: new Set(attempts.map((item) => item.sessionId).filter(Boolean)).size,
                correct: attempts.filter((item) => item.isCorrect === true).length,
                streak: streak?.current || 0,
                courses: 0,
                reviews: 0,
            };
            let achievements = achievementDefinitions(stats);
            try {
                achievements = await syncAchievements(stats);
            } catch {}
            const storedAchievements = await safe(listAchievements(), []);
            if (active)
                setState({
                    enrollments,
                    plans,
                    lessons,
                    bookmarks,
                    attempts,
                    streak,
                    points: points?.value || 0,
                    achievements: storedAchievements.length ? storedAchievements : achievements,
                });
        });
        return () => {
            active = false;
        };
    }, []);
    if (!state) return <Loading />;
    const completedLessons = state.lessons.filter((item) => item.completed).length;
    const completedSteps = state.plans.filter((item) => item.completed).length;
    const unlocked = state.achievements.filter((item) => item.isUnlocked !== false).length;
    return (
        <>
            <PageTitle
                eyebrow="Área pessoal"
                title="Meu estudo"
                description="Seu ritmo, suas trilhas e suas revisões ficam salvos no navegador para você continuar mesmo offline."
                action={
                    <Button
                        component={Link}
                        to="/catalogo"
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                    >
                        Explorar catálogo
                    </Button>
                }
            />
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} md={3}>
                    <StatCard value={state.enrollments.length} label="cursos iniciados" />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard value={completedLessons} label="lições concluídas" />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard value={completedSteps} label="etapas concluídas" />
                </Grid>
                <Grid item xs={6} md={3}>
                    <StatCard value={state.bookmarks.length} label="salvos" />
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                        }}
                    >
                        <CardContent>
                            <Typography variant="overline">Constância</Typography>
                            <Typography variant="h3">{state.streak?.current || 0} dias</Typography>
                            <Typography sx={{ opacity: 0.85 }}>
                                Melhor sequência: {state.streak?.best || 0} dias
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="overline" color="secondary.main">
                                Pontos de estudo
                            </Typography>
                            <Typography variant="h3" color="primary.main">
                                {state.points}
                            </Typography>
                            <Typography color="text.secondary">
                                Por aulas, questões, revisões e simulados concluídos.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="overline" color="secondary.main">
                                Conquistas
                            </Typography>
                            <Typography variant="h3" color="primary.main">
                                {unlocked}
                            </Typography>
                            <Typography color="text.secondary">
                                marcos desbloqueados localmente
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Continue estudando
                    </Typography>
                    {state.enrollments.length ? (
                        state.enrollments.map((item) => (
                            <Card key={item.contentKey} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Box>
                                            <Typography variant="h6">{item.title}</Typography>
                                            <Typography color="text.secondary">
                                                Curso em andamento
                                            </Typography>
                                        </Box>
                                        <Button
                                            component={Link}
                                            to={item.slug ? `/cursos/${item.slug}` : "/catalogo"}
                                            endIcon={<ArrowForwardIcon />}
                                        >
                                            Continuar
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Empty>
                            Você ainda não iniciou um curso. Escolha uma trilha no Catálogo.
                        </Empty>
                    )}
                    <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                        Atalhos
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <CatalogCard
                                icon={<EventNoteIcon />}
                                eyebrow="Plano"
                                title="Seu plano"
                                description="Volte para a próxima etapa recomendada."
                                meta="Estudo guiado"
                                to="/plano"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <CatalogCard
                                icon={<QuizIcon />}
                                eyebrow="Prática"
                                title="Revisar erros"
                                description="Retome questões que precisam de atenção."
                                meta={`${state.attempts.filter((item) => item.isCorrect === false).length} questões`}
                                to="/revisao"
                                color="secondary"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <CatalogCard
                                icon={<BookmarkBorderIcon />}
                                eyebrow="Salvos"
                                title="Favoritos"
                                description="Aulas e materiais guardados para depois."
                                meta={`${state.bookmarks.length} itens`}
                                to="/meu-estudo"
                                color="success"
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Card sx={{ bgcolor: "background.default" }}>
                        <CardContent>
                            <Typography variant="h6">Conquistas recentes</Typography>
                            <Stack spacing={1.5} sx={{ mt: 2 }}>
                                {state.achievements
                                    .filter((item) => item.isUnlocked !== false)
                                    .slice(0, 5)
                                    .map((item) => (
                                        <Paper
                                            key={item.contentKey || item.key}
                                            variant="outlined"
                                            sx={{ p: 1.5 }}
                                        >
                                            <Typography fontWeight={700}>{item.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.description}
                                            </Typography>
                                        </Paper>
                                    ))}
                                {!unlocked && (
                                    <Typography color="text.secondary">
                                        Responda uma questão ou conclua uma aula para começar.
                                    </Typography>
                                )}
                            </Stack>
                            <Button component={Link} to="/plano" variant="contained" sx={{ mt: 2 }}>
                                Abrir plano de estudo
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

function RouteIsland({ children }) {
    const location = useLocation();
    const content = useContent();
    const queryClient = useQueryClient();
    const resetKey = `${location.pathname}${location.search}`;
    const retry = () => {
        content.reload();
        void queryClient.resetQueries();
    };
    return (
        <ContentErrorBoundary resetKey={resetKey} onRetry={retry}>
            {children}
        </ContentErrorBoundary>
    );
}

function AppContent() {
    const island = (element) => <RouteIsland>{element}</RouteIsland>;
    return (
        <Shell>
            <Routes>
                <Route path="/" element={island(<Dashboard />)} />
                <Route path="/catalogo" element={island(<CatalogView />)} />
                <Route path="/cursos/:slug" element={island(<CourseView />)} />
                <Route path="/licoes/:lessonId" element={island(<LessonView />)} />
                <Route path="/listas/:assessmentSetId" element={island(<AssessmentSetPage />)} />
                <Route path="/mapa" element={island(<TopicMapView />)} />
                <Route path="/mapa/:slug" element={island(<TopicMapView />)} />
                <Route path="/plano" element={island(<StudyPlanView />)} />
                <Route path="/plano/:slug" element={island(<StudyPlanView />)} />
                <Route path="/meu-estudo" element={island(<MyStudyPage />)} />
                <Route path="/topicos" element={island(<TopicBrowser />)} />
                <Route path="/topicos/:slug" element={island(<TopicStudy />)} />
                <Route path="/questoes" element={island(<QuestionBrowser />)} />
                <Route path="/questoes/:questionId" element={island(<QuestionView />)} />
                <Route path="/simulado" element={island(<SimulatorSetup />)} />
                <Route path="/simulado/:sessionId" element={island(<SimulatorRunner />)} />
                <Route
                    path="/simulado/:sessionId/resultado"
                    element={island(<SimulatorResult />)}
                />
                <Route path="/desempenho" element={island(<PerformanceDashboard />)} />
                <Route path="/revisao" element={island(<ReviewQueue />)} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Shell>
    );
}
export function App() {
    return <AppContent />;
}
