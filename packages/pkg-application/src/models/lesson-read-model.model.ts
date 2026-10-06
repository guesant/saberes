import type { LessonTopicReadModel } from "./lesson-topic-read-model.interface";

export interface LessonReadModel {
  lesson: Record<string, unknown>;
  sections: Array<Record<string, unknown>>;
  sources: Array<Record<string, unknown>>;
  topics: LessonTopicReadModel[];
}
