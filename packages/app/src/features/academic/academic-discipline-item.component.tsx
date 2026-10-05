import { UICard, UICardContent, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { AcademicDisciplineCalculationDetails } from "./academic-discipline-calculation-details.component";
import { AcademicDisciplineItemActions } from "./academic-discipline-item-actions.component";
import type { SaveAcademicDisciplineInput } from "./save-academic-discipline-input.interface";
import type { AcademicDiscipline, AcademicMetrics } from "@guesant/saberes-application";

export interface AcademicDisciplineItemProps {
  discipline: AcademicDiscipline;

  metrics: AcademicMetrics | undefined;

  onRemove(id: string): Promise<void>;

  onSave(input: SaveAcademicDisciplineInput): Promise<void>;
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
          <AcademicDisciplineItemActions
            discipline={props.discipline}
            onRemove={props.onRemove}
            onSave={props.onSave}
          />
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
