import type { ContentKey } from "./content-key.type";

export interface LessonProgressRecord {
  contentKey: ContentKey | string;
  lessonId?: number | string;
  completed?: boolean;
  [key: string]: unknown;
}
