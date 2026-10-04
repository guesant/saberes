import type { ReviewPreview } from "./review-preview.type";
import type { ReviewTarget } from "@guesant/saberes-application";

export type GetReviewPreviewsInput = {
  targets: ReviewTarget[];
  preview(target: ReviewTarget): ReviewPreview;
};

export function getReviewPreviews(input: GetReviewPreviewsInput): Record<string, ReviewPreview> {
  return Object.fromEntries(
    input.targets.map((target) => [target.contentKey, input.preview(target)]),
  );
}
