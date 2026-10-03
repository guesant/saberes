import type { ReviewTarget } from "../models/index";

export interface PreviewReviewPort {
  execute(input: {
    target: ReviewTarget;
    now?: Date;
  }): Record<string, { dueAt: string; interval: number }>;
}
