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
import { StudyPlanStepSkipAction } from "./study-plan-step-skip-action.component";
import { StudyPlanStepStatus } from "./study-plan-step-status.component";

export type StudyPlanStepProps = {
  step: Record<string, unknown>;
  completed: boolean;
  skipped: boolean;
  onToggle: (step: Record<string, unknown>, completed: boolean) => Promise<void>;
  onSkip: (stepId: string) => Promise<void>;
};

export function StudyPlanStep(props: StudyPlanStepProps) {
  const { t } = useTranslation();

  return (
    <UIPaper variant="outlined">
      <UIStartAlignedRow>
        <UIIconButton
          aria-label={props.completed ? t("lesson.completed") : t("lesson.complete")}
          onClick={() => props.onToggle(props.step, !props.completed)}
        >
          {props.completed ? <UICheckCircleIcon /> : <UIEventNoteIcon />}
        </UIIconButton>

        <UIContentGroup variant="tight">
          <UITypography variant="h6">
            {String(props.step.position)}.{String(props.step.title)}
          </UITypography>

          <UITypography color="text.secondary">{String(props.step.description || "")}</UITypography>

          <StudyPlanStepStatus completed={props.completed} skipped={props.skipped} />
          <StudyPlanStepSkipAction
            disabled={props.completed || props.skipped}
            stepId={String(props.step.id)}
            onSkip={props.onSkip}
          />
        </UIContentGroup>
      </UIStartAlignedRow>
    </UIPaper>
  );
}
