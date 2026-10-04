export interface TopicReadModel {
  topic: Record<string, unknown>;
  children: Array<Record<string, unknown>>;
  lessons: Array<Record<string, unknown>>;
  prerequisites: Array<Record<string, unknown>>;
  questions: Array<Record<string, unknown>>;
  related: Array<Record<string, unknown>>;
}
