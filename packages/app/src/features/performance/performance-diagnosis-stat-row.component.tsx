import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { PerformanceDiagnosisStat } from "./performance-diagnosis-stat.interface";

export type PerformanceDiagnosisStatRowProps = {
  stat: PerformanceDiagnosisStat;
};

export function PerformanceDiagnosisStatRow(props: PerformanceDiagnosisStatRowProps) {
  const { t } = useTranslation();

  return (
    <UITypography color="text.secondary">
      {t("performance.diagnosisRow", {
        attempts: props.stat.attempts,
        diagnosis: t(`exercise.diagnosis.${props.stat.code}`),
      })}
    </UITypography>
  );
}
