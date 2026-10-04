import { createPostponeReviewAction } from "./create-postpone-review-action.function";
import { createRateReviewAction } from "./create-rate-review-action.function";
import { createSuspendReviewAction } from "./create-suspend-review-action.function";
import type { ApplicationServices, FsrsRating, ReviewTarget } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export type CreateReviewActionsInput = {
  retention: number;
  services: ApplicationServices;
  queryClient: QueryClient;
};

export function createReviewActions(input: CreateReviewActionsInput) {
  const postpone = createPostponeReviewAction({ services: input.services });

  const rate = createRateReviewAction({ retention: input.retention, services: input.services });

  const suspend = createSuspendReviewAction({ services: input.services });

  const updateReviewQueryCache = async (): Promise<void> => {
    await input.queryClient.invalidateQueries({ queryKey: ["progress", "reviews"] });
  };

  return {
    postpone: async (target: ReviewTarget): Promise<void> => {
      await postpone(target);

      await updateReviewQueryCache();
    },
    rate: async (target: ReviewTarget, rating: FsrsRating): Promise<void> => {
      await rate(target, rating);

      await updateReviewQueryCache();
    },
    suspend: async (target: ReviewTarget): Promise<void> => {
      await suspend(target);

      await updateReviewQueryCache();
    },
  };
}
