import type { ApplicationServices, ReviewTarget } from "@guesant/saberes-application";

export interface GetReviewViewModelPreviewsInput {
  retention: number;
  services: ApplicationServices;
  targets: ReviewTarget[];
}
