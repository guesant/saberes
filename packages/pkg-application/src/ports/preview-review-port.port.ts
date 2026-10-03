import type { ReviewTarget } from "../models/progress.models.ts";

export interface PreviewReviewPort {
  execute(input: {
    target: ReviewTarget;
    now?: Date;
  }): Record<string, { dueAt: string; interval: number }>;
}
