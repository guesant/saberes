import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { AcademicRequiredFinalGrade } from "./academic-required-final-grade.component";
import { AcademicRiskMessage } from "./academic-risk-message.component";
import type { AcademicDiscipline, AcademicMetrics } from "@guesant/saberes-application";

export interface AcademicDisciplineCalculationDetailsProps {
  discipline: AcademicDiscipline;
  metrics: AcademicMetrics | undefined;
}

export function AcademicDisciplineCalculationDetails(
  props: AcademicDisciplineCalculationDetailsProps,
) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography color="text.secondary">
        {t("academic.minimumGrade", { value: props.discipline.minimumGrade })}
      </UITypography>
      <AcademicRequiredFinalGrade value={props.metrics?.requiredFinalGrade} />
      <AcademicRiskMessage
        active={props.metrics?.attendanceRisk}
        message={t("academic.attendanceRisk")}
      />
      <AcademicRiskMessage active={props.metrics?.gradeRisk} message={t("academic.gradeRisk")} />
      <UITypography color="text.secondary" variant="caption">
        {t("academic.calculationExplanation")}
      </UITypography>
    </UIContentGroup>
  );
}
