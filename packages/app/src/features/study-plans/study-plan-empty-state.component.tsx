import {
  UIButton,
  UIContentGroup,
  UIContentSurface,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function StudyPlanEmptyState() {
  const { t } = useTranslation();

  return (
    <UIContentSurface mode="outlined">
      <UIContentGroup variant="content">
        <UITypography variant="h3">{t("plan.notFound")}</UITypography>
        <UITypography color="text.secondary">
          {t("plan.notFoundDescription")}
        </UITypography>
        <UIButton href="/catalogo" variant="contained">
          {t("plan.openCatalog")}
        </UIButton>
      </UIContentGroup>
    </UIContentSurface>
  );
}
