import {
  UICard,
  UICardContent,
  UIContentGroup,
  UILinearProgress,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { createCompletedStepSet } from "./create-completed-step-set.function";
import { getStudyPlanDescription } from "./get-study-plan-description.function";
import { getStudyPlanProgress } from "./get-study-plan-progress.function";
import { StudyPlanSteps } from "./study-plan-steps.component";
import type { StudyPlanReadModel } from "@guesant/saberes-application";

export type StudyPlanReadyViewProps = {
  data: StudyPlanReadModel;
  progress: Array<Record<string, unknown>>;
  onToggle: (step: Record<string, unknown>, completed: boolean) => Promise<void>;
};

export function StudyPlanReadyView(props: StudyPlanReadyViewProps) {
  const { data, progress, onToggle } = props;

  const { t } = useTranslation();

  const completed = createCompletedStepSet(progress);

  const planProgress = getStudyPlanProgress({ steps: data.steps, completed });

  return (
    <>
      <UITypography variant="overline">{t("plan.eyebrow")}</UITypography>

      <UITypography variant="h3">{String(data.plan?.title)}</UITypography>

      <UITypography color="text.secondary">{getStudyPlanDescription(data)}</UITypography>

      <UIContentGroup variant="tight">
        <UITypography variant="body2">
          {t("plan.progress", {
            completed: planProgress.completedSteps,
            percentage: planProgress.percentage,
            total: planProgress.totalSteps,
          })}
        </UITypography>

        <UILinearProgress value={planProgress.percentage} variant="determinate" />
      </UIContentGroup>

      <UIContentGroup variant="content">
        <StudyPlanSteps steps={data.steps} completed={completed} onToggle={onToggle} />
      </UIContentGroup>

      <UICard>
        <UICardContent>{t("plan.editorialNotice")}</UICardContent>
      </UICard>
    </>
  );
}
