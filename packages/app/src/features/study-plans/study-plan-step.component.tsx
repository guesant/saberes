import {
  UICheckCircleIcon,
  UIEventNoteIcon,
  UIIconButton,
  UIPaper,
  UIContentGroup,
  UIStartAlignedRow,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { StudyPlanStepMoveActions } from "./study-plan-step-move-actions.component";
import { StudyPlanStepSkipAction } from "./study-plan-step-skip-action.component";
import { StudyPlanStepStatus } from "./study-plan-step-status.component";

export type StudyPlanStepProps = {
  step: Record<string, unknown>;
  completed: boolean;
  skipped: boolean;
  onToggle(step: Record<string, unknown>, completed: boolean): Promise<void>;

  onSkip(stepId: string): Promise<void>;

  onMove(stepId: string, direction: -1 | 1): Promise<void>;
};

export function StudyPlanStep(props: StudyPlanStepProps) {
  const { t } = useTranslation();

  return (
    <UIPaper variant="outlined">
      <UIStartAlignedRow>
        <UIIconButton
          aria-label={props.completed ? t("lesson.completed") : t("lesson.complete")}
          onClick={() => {
            return props.onToggle(props.step, !props.completed);
          }}
        >
          {props.completed ? <UICheckCircleIcon /> : <UIEventNoteIcon />}
        </UIIconButton>

        <UIContentGroup variant="content">
          <UITypography variant="h6">
            {String(props.step.position)}.{String(props.step.title)}
          </UITypography>

          <UITypography color="text.secondary">{String(props.step.description || "")}</UITypography>

          <StudyPlanStepStatus completed={props.completed} skipped={props.skipped} />
          <StudyPlanStepSkipAction
            disabled={props.completed}
            skipped={props.skipped}
            stepId={String(props.step.id)}
            onSkip={props.onSkip}
          />
          <StudyPlanStepMoveActions stepId={String(props.step.id)} onMove={props.onMove} />
        </UIContentGroup>
      </UIStartAlignedRow>
    </UIPaper>
  );
}
