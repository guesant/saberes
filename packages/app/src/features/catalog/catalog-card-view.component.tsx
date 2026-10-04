import {
  UIAutoStoriesIcon,
  UIAccentIcon,
  UIButton,
  UIFullHeightCard,
  UICardContent,
  UIChip,
  UIQuizIcon,
  UITypography,
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

  const icon = item.type === "lesson" ? <UIAutoStoriesIcon /> : <UIQuizIcon />;

  return (
    <UIFullHeightCard>
      <UICardContent>
        <UIAccentIcon>{icon}</UIAccentIcon>

        <UIChip label={typeLabel} size="small" variant="outlined" />

        <UITypography variant="h6">{String(item.title)}</UITypography>

        <UITypography variant="body2" color="text.secondary">
          {String(item.description || "")}
        </UITypography>

        <UIButton component={Link} to={path} size="small">
          {t("common.open")}
        </UIButton>
      </UICardContent>
    </UIFullHeightCard>
  );
}
