import type { ReviewTarget } from "../models/index";

export interface ListReviewTargetsPort {
  execute(): Promise<ReviewTarget[]>;
}
