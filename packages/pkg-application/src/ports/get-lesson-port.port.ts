import type { ContentKey, LessonReadModel } from "../models/content.models.ts";

export interface GetLessonPort {
  execute(key: ContentKey | string): Promise<LessonReadModel | null>;
}
