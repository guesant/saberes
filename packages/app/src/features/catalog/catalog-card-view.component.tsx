import {
  UIAutoStoriesIcon,
  UIAccentIcon,
  UIFullHeightCard,
  UICardContent,
  UIChip,
  UIQuizIcon,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getCatalogCardPath } from "../../components/get-catalog-card-path.function";
import type { CatalogCard } from "@guesant/saberes-application";

export type CatalogCardViewProps = {
  item: CatalogCard;
};

export function CatalogCardView(props: CatalogCardViewProps) {
  const { item } = props;

  const { t } = useTranslation();

  const typeLabel = t(`catalog.type.${item.type}`, { defaultValue: item.type });

  const path = getCatalogCardPath(item);

  const icon = item.type === "lesson" ? <UIAutoStoriesIcon /> : <UIQuizIcon />;

  return (
    <UIFullHeightCard action={<Link aria-label={`${t("common.open")}: ${String(item.title)}`} to={path} />}>
      <UICardContent>
        <UIAccentIcon>{icon}</UIAccentIcon>

        <UIChip label={typeLabel} size="small" variant="outlined" />

        <UITypography variant="h6">{String(item.title)}</UITypography>

        <UITypography variant="body2" color="text.secondary">
          {String(item.description || "")}
        </UITypography>
        <UITypography color="primary" variant="button">
          {t("common.open")} →
        </UITypography>

      </UICardContent>
    </UIFullHeightCard>
  );
}
