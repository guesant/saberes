import type { StudyRecord } from "../models/index";

export interface ListReviewItemsPort {
  execute(): Promise<StudyRecord[]>;
}
