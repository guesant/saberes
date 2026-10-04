export interface LessonReadModel {
  lesson: Record<string, unknown>;
  sections: Array<Record<string, unknown>>;
  sources: Array<Record<string, unknown>>;
}
