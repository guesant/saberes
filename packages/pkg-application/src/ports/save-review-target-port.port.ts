import type { ContentKey, ReviewTarget } from "../models/index.ts";

export interface SaveReviewTargetPort {
  execute(input: {
    contentKey: ContentKey | string;
    data?: Partial<ReviewTarget>;
  }): Promise<ReviewTarget>;
}
