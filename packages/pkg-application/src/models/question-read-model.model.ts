export interface QuestionReadModel {
  question: Record<string, unknown>;
  options: Array<Record<string, unknown>>;
  parts: Array<Record<string, unknown>>;
  topics: Array<Record<string, unknown>>;
  related: Array<Record<string, unknown>>;
}
