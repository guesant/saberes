import type { ContentKey } from "./content.models.ts";

export interface LessonProgressRecord {
  contentKey: ContentKey | string;
  lessonId?: number | string;
  completed?: boolean;
  [key: string]: unknown;
}
