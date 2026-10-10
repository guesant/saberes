import type { AssessmentBlueprintCandidate } from "./assessment-blueprint-candidate.interface";
import type { AssessmentBlueprintRule } from "./assessment-blueprint-rule.interface";

export interface AssessmentBlueprintSelectionInput {
  blueprintId: number | string;
  blueprintVersion: string;
  stageKey: string;
  expectedQuestionCount: number;
  seed: string;
  rules: AssessmentBlueprintRule[];
  candidates: AssessmentBlueprintCandidate[];
}
