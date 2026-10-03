import type { StudyRecord } from "../models/index";
import type { ContentKey } from "@guesant/saberes-domain";

export interface SaveReviewItemPort {
  execute(input: {
    contentKey: ContentKey | string;
    data?: Record<string, unknown>;
  }): Promise<StudyRecord>;
}
