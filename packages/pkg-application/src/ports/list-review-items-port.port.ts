import type { StudyRecord } from "../models/progress.models.ts";

export interface ListReviewItemsPort {
  execute(): Promise<StudyRecord[]>;
}
