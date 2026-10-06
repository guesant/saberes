import { getAssessmentQuestionKeys } from "./get-assessment-question-keys.function";
import type { CreateAssessmentQuestionWeightsInput } from "./create-assessment-question-weights-input.interface";
import type { SimulationQuestionWeight } from "@guesant/saberes-application";

export function createAssessmentQuestionWeights(
  input: CreateAssessmentQuestionWeightsInput,
): SimulationQuestionWeight[] {
  return input.questionKeys.map((questionKey) => {
    const item = input.items.find((candidate) => {
      return getAssessmentQuestionKeys([candidate])[0] === questionKey;
    });

    return { questionKey, maxPoints: item?.max_points ?? 1 };
  });
}
