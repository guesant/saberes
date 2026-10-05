import { UIButton, UICard, UICardContent, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { AcademicDisciplineCalculationDetails } from "./academic-discipline-calculation-details.component";
import type { AcademicDiscipline, AcademicMetrics } from "@guesant/saberes-application";

export interface AcademicDisciplineItemProps {
  discipline: AcademicDiscipline;
  metrics: AcademicMetrics | undefined;
  onRemove(id: string): Promise<void>;
}

export function AcademicDisciplineItem(props: AcademicDisciplineItemProps) {
  const { t } = useTranslation();

  return (
    <UICard variant="outlined">
      <UICardContent>
        <UIContentGroup variant="content">
          <UITypography variant="h6">{props.discipline.name}</UITypography>
          <UITypography>
            {t("academic.attendance", {
              value: props.metrics?.attendancePercentage || 0,
            })}
          </UITypography>
          <UITypography color="text.secondary">
            {t("academic.average", { value: props.metrics?.currentAverage || 0 })}
          </UITypography>
          <UITypography color="text.secondary">
            {t("academic.grades", { value: props.discipline.grades.length })}
          </UITypography>
          <AcademicDisciplineCalculationDetails
            discipline={props.discipline}
            metrics={props.metrics}
          />
          <UIButton
            onClick={() => {
              return props.onRemove(props.discipline.id);
            }}
            variant="text"
          >
            {t("academic.remove")}
          </UIButton>
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
