import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { createCompletedStepSet } from "./create-completed-step-set.function";
import { getStudyPlanDescription } from "./get-study-plan-description.function";
import { getStudyPlanProgress } from "./get-study-plan-progress.function";
import { StudyPlanControls } from "./study-plan-controls.component";
import { StudyPlanEditorialNotice } from "./study-plan-editorial-notice.component";
import { StudyPlanProgressSummary } from "./study-plan-progress-summary.component";
import { StudyPlanSteps } from "./study-plan-steps.component";
import type { StudyPlanLocalState } from "./study-plan-local-state.interface";
import type { StudyPlanReadModel } from "@guesant/saberes-application";

export type StudyPlanReadyViewProps = {
  data: StudyPlanReadModel;
  steps: Array<Record<string, unknown>>;
  progress: Array<Record<string, unknown>>;
  onToggle: (step: Record<string, unknown>, completed: boolean) => Promise<void>;
  localState: StudyPlanLocalState;
  nextStep: Record<string, unknown> | null;
  onTogglePause: () => Promise<void>;
  onTargetDateChange: (targetDate: string) => Promise<void>;
  onDailyMinutesChange: (dailyMinutes: number) => Promise<void>;
  skippedStepIds: Set<string>;
  onSkip: (stepId: string) => Promise<void>;
};

export function StudyPlanReadyView(props: StudyPlanReadyViewProps) {
  const { t } = useTranslation();

  const completed = createCompletedStepSet(props.progress);

  const planProgress = getStudyPlanProgress({ steps: props.data.steps, completed });

  return (
    <>
      <UITypography variant="overline">{t("plan.eyebrow")}</UITypography>

      <UITypography variant="h3">{String(props.data.plan?.title)}</UITypography>

      <UITypography color="text.secondary">{getStudyPlanDescription(props.data)}</UITypography>

      <StudyPlanControls
        state={props.localState}
        onTogglePause={props.onTogglePause}
        onTargetDateChange={props.onTargetDateChange}
        onDailyMinutesChange={props.onDailyMinutesChange}
      />

      <StudyPlanProgressSummary
        completedSteps={planProgress.completedSteps}
        percentage={planProgress.percentage}
        totalSteps={planProgress.totalSteps}
        nextStep={props.nextStep}
      />

      <UIContentGroup variant="content">
        <StudyPlanSteps
          steps={props.steps}
          completed={completed}
          skipped={props.skippedStepIds}
          onToggle={props.onToggle}
          onSkip={props.onSkip}
        />
      </UIContentGroup>

      <StudyPlanEditorialNotice />
    </>
  );
}
