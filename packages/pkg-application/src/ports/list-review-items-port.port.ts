import type { StudyRecord } from "../models/index.ts";

export interface ListReviewItemsPort {
  execute(): Promise<StudyRecord[]>;
}
