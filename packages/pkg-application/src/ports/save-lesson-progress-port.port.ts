import type { ContentKey, StudyRecord } from "../models/index.ts";

export interface SaveLessonProgressPort {
  execute(input: {
    contentKey: ContentKey | string;
    data?: Record<string, unknown>;
  }): Promise<StudyRecord>;
}
