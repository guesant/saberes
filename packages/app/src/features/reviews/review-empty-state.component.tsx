import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function ReviewEmptyState() {
  const { t } = useTranslation();

  return <UITypography>{t("review.empty")}</UITypography>;
}
