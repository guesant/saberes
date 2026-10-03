import type { StudyRecord } from "../models/index";
import type { ContentKey } from "@guesant/saberes-domain";

export interface SaveLessonProgressPort {
  execute(input: {
    contentKey: ContentKey | string;
    data?: Record<string, unknown>;
  }): Promise<StudyRecord>;
}
