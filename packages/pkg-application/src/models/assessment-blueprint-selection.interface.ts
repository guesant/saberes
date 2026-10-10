export interface AssessmentBlueprintSelection {
  blueprintId: number | string;
  blueprintVersion: string;
  stageKey: string;
  seed: string;
  ready: boolean;
  questionKeys: string[];
  assignments: Array<{ ruleId: number | string; questionKey: string; canonicalQuestionId: number | string }>;
  insufficiencies: Array<{ ruleId: number | string; requested: number; available: number; missing: number }>;
}
