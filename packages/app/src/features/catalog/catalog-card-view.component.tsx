import {
  AutoStoriesIcon,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  QuizIcon,
  Typography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { CatalogCard } from "@guesant/saberes-application";

export type CatalogCardViewProps = {
  item: CatalogCard;
};

export function CatalogCardView(props: CatalogCardViewProps) {
  const { item } = props;

  const { t } = useTranslation();

  const typeLabel = t(`catalog.type.${item.type}`, { defaultValue: item.type });

  const paths = {
    course: `/cursos/${item.slug}`,
    map: `/mapa/${item.slug}`,
    plan: `/plano/${item.slug}`,
    lesson: `/licoes/${item.id}`,
    resource: `/licoes/${item.id}`,
    question: `/questoes/${item.id}`,
  };

  const path = paths[item.type] || `/licoes/${item.id}`;

  const icon = item.type === "lesson" ? <AutoStoriesIcon /> : <QuizIcon />;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box color="primary.main">{icon}</Box>

        <Chip label={typeLabel} size="small" variant="outlined" />

        <Typography variant="h6">{String(item.title)}</Typography>

        <Typography variant="body2" color="text.secondary">
          {String(item.description || "")}
        </Typography>

        <Button component={Link} to={path} size="small">
          {t("common.open")}
        </Button>
      </CardContent>
    </Card>
  );
}
