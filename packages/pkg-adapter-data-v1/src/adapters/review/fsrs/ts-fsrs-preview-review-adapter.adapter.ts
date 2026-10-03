import { previewReview } from "./preview-review.function";
import type { PreviewReviewPort } from "@guesant/saberes-application";

export class TsFsrsPreviewReviewAdapter implements PreviewReviewPort {
  public execute(input: Parameters<PreviewReviewPort["execute"]>[0]) {
    return previewReview(input.target as never, {
      now: input.now || new Date(),
      createDate: (value) => new Date(value),
    });
  }
}
