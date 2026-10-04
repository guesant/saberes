import type { PreviewReviewEntry, PreviewReviewInput } from "../models/index";

export interface PreviewReviewPort {
  execute(input: PreviewReviewInput): Record<string, PreviewReviewEntry>;
}
