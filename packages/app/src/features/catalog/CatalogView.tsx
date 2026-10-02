import type { CatalogCard } from "@guesant/saberes-core";
import {
    AutoStories,
    EventNote,
    Explore,
    Map as MapIcon,
    Quiz,
    School,
} from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Grid,
    InputAdornment,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useCatalogViewModel } from "./useCatalogViewModel";

function minutes(value: unknown, guidedContent: string) {
    return value ? `${String(value)} min` : guidedContent;
}

function CardItem({ item }: { item: CatalogCard }) {
    const { t } = useTranslation();
    const typeLabel = t(`catalog.type.${item.type}`, {
        defaultValue: item.type,
    });
    const icons = {
        course: <School />,
        map: <MapIcon />,
        plan: <EventNote />,
        lesson: <AutoStories />,
        resource: <Explore />,
        question: <Quiz />,
    } as const;
    const paths = {
        course: `/cursos/${item.slug}`,
        map: `/mapa/${item.slug}`,
        plan: `/plano/${item.slug}`,
        lesson: `/licoes/${item.id}`,
        question: `/questoes/${item.id}`,
    } as const;
    const icon = icons[item.type as keyof typeof icons] || <Quiz />;
    const to = paths[item.type as keyof typeof paths];
    let meta = String(item.meta || "");
    if (item.type === "course") {
        meta = `${String(item.moduleCount || 0)} módulos · ${minutes(item.totalMinutes, t("catalog.guidedContent"))}`;
    } else if (item.type === "map") {
        meta = `${String(item.topicCount || 0)} tópicos`;
    } else if (item.type === "plan") {
        meta = `${String(item.stepCount || 0)} etapas`;
    }
    const content = (
        <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ color: "primary.main" }}>{icon}</Box>
            <Chip
                label={typeLabel}
                size="small"
                variant="outlined"
                sx={{ mt: 1 }}
            />
            <Typography variant="h6" sx={{ mt: 1 }}>
                {String(item.title)}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, minHeight: 40 }}
            >
                {String(item.description || "")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {meta}
            </Typography>
            <Button
                size="small"
                component={to ? Link : "a"}
                to={to}
                href={item.href as string | undefined}
                target={item.href ? "_blank" : undefined}
                sx={{ display: "block", mt: 1 }}
            >
                {t("common.open")}
            </Button>
        </CardContent>
    );
    return (
        <Card sx={{ height: "100%" }}>
            {to || item.href ? (
                <CardActionArea
                    component={item.href ? "a" : Link}
                    to={to}
                    href={item.href}
                    target={item.href ? "_blank" : undefined}
                    rel={item.href ? "noreferrer" : undefined}
                    sx={{ height: "100%" }}
                >
                    {content}
                </CardActionArea>
            ) : (
                content
            )}
        </Card>
    );
}

export function CatalogView() {
    const { t } = useTranslation();
    const viewModel = useCatalogViewModel();
    const [tab, setTab] = useState(0);
    if (viewModel.state === "loading")
        return <Typography>{t("common.loadingCatalog")}</Typography>;
    if (viewModel.state === "error")
        return <Typography color="error">{t("errors.catalogLoad")}</Typography>;
    const data = viewModel.data || {
        courses: [],
        maps: [],
        plans: [],
        content: [],
    };
    const sections = [data.courses, data.maps, data.plans, data.content];
    return (
        <>
            <Typography variant="overline" color="secondary.main">
                {t("catalog.eyebrow")}
            </Typography>
            <Typography variant="h3" sx={{ mt: 0.5 }}>
                {t("catalog.title")}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                {t("catalog.description")}
            </Typography>
            <TextField
                fullWidth
                placeholder={t("catalog.searchPlaceholder")}
                value={viewModel.filters.search || ""}
                onChange={(event) =>
                    viewModel.setFilters({ search: event.target.value })
                }
                sx={{ mb: 3, maxWidth: 720 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Explore />
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
                <Tab label={`${t("catalog.courses")} ${data.courses.length}`} />
                <Tab label={`${t("catalog.maps")} ${data.maps.length}`} />
                <Tab label={`${t("catalog.plans")} ${data.plans.length}`} />
                <Tab
                    label={`${t("catalog.contents")} ${data.content.length}`}
                />
            </Tabs>
            <Grid container spacing={2}>
                {sections[tab].length ? (
                    sections[tab].map((item) => (
                        <Grid
                            size={{ xs: 12, md: 6 }}
                            key={`${item.type}-${item.id}`}
                        >
                            <CardItem item={item} />
                        </Grid>
                    ))
                ) : (
                    <Grid size={12}>
                        <Typography color="text.secondary">
                            {t("catalog.noResults")}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </>
    );
}
