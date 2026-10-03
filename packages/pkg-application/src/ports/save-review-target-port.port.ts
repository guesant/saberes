import type { ReviewTarget } from "../models/index";
import type { ContentKey } from "@guesant/saberes-domain";

export interface SaveReviewTargetPort {
  execute(input: {
    contentKey: ContentKey | string;
    data?: Partial<ReviewTarget>;
  }): Promise<ReviewTarget>;
}
