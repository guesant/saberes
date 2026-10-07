import { UIInlineActions } from "@guesant/saberes-ui";
import { StudyPlanStepStatus } from "./study-plan-step-status.component";
import type { StudyPlanStepStatusGroupProps } from "./study-plan-step-status-group-props.interface";

export function StudyPlanStepStatusGroup(props: StudyPlanStepStatusGroupProps) {
  return (
    <UIInlineActions>
      <StudyPlanStepStatus completed={props.completed} skipped={props.skipped} />
    </UIInlineActions>
  );
}
