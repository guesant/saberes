import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function FocusEmptyState() {
  const { t } = useTranslation();

  return <UITypography color="text.secondary">{t("focus.empty")}</UITypography>;
}
