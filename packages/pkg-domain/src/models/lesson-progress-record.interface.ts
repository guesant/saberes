import type { ContentKey } from "./content-key.type.ts";

export interface LessonProgressRecord {
  contentKey: ContentKey | string;
  lessonId?: number | string;
  completed?: boolean;
  [key: string]: unknown;
}
