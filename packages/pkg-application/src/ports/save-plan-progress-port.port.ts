import type { ContentKey } from "../models/content.models.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export interface SavePlanProgressPort {
  execute(input: {
    contentKey: ContentKey | string;
    data?: Record<string, unknown>;
  }): Promise<StudyRecord>;
}
