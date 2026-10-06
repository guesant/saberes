import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function QuestionDiagnosisError() {
  const { t } = useTranslation();

  return <UITypography color="error" role="alert">{t("exercise.diagnosisError")}</UITypography>;
}
