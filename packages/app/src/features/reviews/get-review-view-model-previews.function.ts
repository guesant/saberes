import { getReviewPreviews } from "./get-review-previews.function";
import type { GetReviewViewModelPreviewsInput } from "./get-review-view-model-previews-input.interface";
import type { ReviewPreview } from "./review-preview.type";

export function getReviewViewModelPreviews(
  input: GetReviewViewModelPreviewsInput,
): Record<string, ReviewPreview> {
  return getReviewPreviews({
    preview: (target) => {
      return input.services.scheduler.preview.execute({
        requestRetention: input.retention,
        target,
      });
    },
    targets: input.targets,
  });
}
