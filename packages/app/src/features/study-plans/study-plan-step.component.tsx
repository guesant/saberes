import {
  UICheckCircleIcon,
  UIEventNoteIcon,
  UIIconButton,
  UIPaper,
  UIContentGroup,
  UIStartAlignedRow,
  UITypography,
  UIChip,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export type StudyPlanStepProps = {
  step: Record<string, unknown>;
  completed: boolean;
  onToggle: (step: Record<string, unknown>, completed: boolean) => Promise<void>;
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

          <UIChip size="small" label={props.completed ? t("plan.completed") : t("plan.nextStep")} />
        </UIContentGroup>
      </UIStartAlignedRow>
    </UIPaper>
  );
}
