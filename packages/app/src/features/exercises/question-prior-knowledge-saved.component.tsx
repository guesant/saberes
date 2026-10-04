import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function QuestionPriorKnowledgeSaved() {
  const { t } = useTranslation();

  return <UITypography>{t("exercise.priorKnowledgeSaved")}</UITypography>;
}
