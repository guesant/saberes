import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function PersonalWorkspaceEmptyState() {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography variant="h5">{t("personal.emptyTitle")}</UITypography>
      <UITypography color="text.secondary">{t("personal.emptyDescription")}</UITypography>
    </UIContentGroup>
  );
}
