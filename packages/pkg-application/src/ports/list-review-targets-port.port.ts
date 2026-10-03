import type { ReviewTarget } from "../models/progress.models.ts";

export interface ListReviewTargetsPort {
  execute(): Promise<ReviewTarget[]>;
}
