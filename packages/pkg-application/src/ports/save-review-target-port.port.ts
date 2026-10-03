import type { ContentKey } from "../models/content.models.ts";
import type { ReviewTarget } from "../models/progress.models.ts";

export interface SaveReviewTargetPort {
  execute(input: {
    contentKey: ContentKey | string;
    data?: Partial<ReviewTarget>;
  }): Promise<ReviewTarget>;
}
