import type { UndoStudyPlanRearrangementInput } from "./undo-study-plan-rearrangement-input.interface";

export function undoStudyPlanRearrangement(input: UndoStudyPlanRearrangementInput): string[] {
  return [...input.previousOrder];
}
