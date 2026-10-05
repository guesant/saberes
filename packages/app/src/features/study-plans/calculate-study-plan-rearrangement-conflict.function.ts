import type { DetectStudyPlanRearrangementConflictInput } from "./detect-study-plan-rearrangement-conflict-input.interface";
import type { StudyPlanRearrangementConflict } from "./study-plan-rearrangement-conflict.interface";

export function calculateStudyPlanRearrangementConflict(
  input: DetectStudyPlanRearrangementConflictInput,
): StudyPlanRearrangementConflict {
  const baselineIds = new Set(input.baselineOrder);

  const candidateIds = new Set(input.candidateOrder);

  const duplicatedStepIds = input.candidateOrder.filter((stepId, index, order) => {
    return order.indexOf(stepId) !== index && order.indexOf(stepId) === index - 1;
  });

  const missingStepIds = input.baselineOrder.filter((stepId) => {
    return !candidateIds.has(stepId);
  });

  const unexpectedStepIds = input.candidateOrder.filter((stepId) => {
    return !baselineIds.has(stepId);
  });

  return {
    duplicatedStepIds,
    hasConflict:
      duplicatedStepIds.length > 0 || missingStepIds.length > 0 || unexpectedStepIds.length > 0,
    missingStepIds,
    unexpectedStepIds,
  };
}
