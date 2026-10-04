import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function QuestionDiagnosisSaved() {
  const { t } = useTranslation();

  return <UITypography>{t("exercise.diagnosisSaved")}</UITypography>;
}
