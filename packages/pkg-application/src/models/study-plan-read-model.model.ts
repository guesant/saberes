export interface StudyPlanReadModel {
  plan: Record<string, unknown> | null;
  steps: Array<Record<string, unknown>>;
}
