import type { ReviewTarget } from "../models/index.ts";

export interface ListReviewTargetsPort {
  execute(): Promise<ReviewTarget[]>;
}
