import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function LessonSourcesEmpty() {
  const { t } = useTranslation();

  return <UITypography color="text.secondary">{t("lesson.sourcesUnavailable")}</UITypography>;
}
