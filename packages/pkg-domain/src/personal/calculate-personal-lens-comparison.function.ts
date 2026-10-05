import type { CalculatePersonalLensComparisonInput } from "./calculate-personal-lens-comparison-input.interface";
import type { PersonalLensComparison } from "./personal-lens-comparison.interface";

export function calculatePersonalLensComparison(
  input: CalculatePersonalLensComparisonInput,
): PersonalLensComparison {
  const changedRecordTypes = input.candidateLens.recordTypes.filter((recordType) => {
    return !input.currentLens.recordTypes.includes(recordType);
  });

  return {
    candidateView: input.candidateLens.view,
    changedRecordTypes,
    changedView: input.currentLens.view !== input.candidateLens.view,
    currentView: input.currentLens.view,
    sameName: input.currentLens.name === input.candidateLens.name,
  };
}
