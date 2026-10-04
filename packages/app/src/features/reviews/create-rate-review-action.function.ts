import type { AsyncAction } from "../../types/async-action.type";
import type { ApplicationServices, FsrsRating, ReviewTarget } from "@guesant/saberes-application";

export type CreateRateReviewActionInput = {
  retention: number;
  services: ApplicationServices;
};

export function createRateReviewAction(
  input: CreateRateReviewActionInput,
): AsyncAction<[ReviewTarget, FsrsRating], void> {
  return async (target: ReviewTarget, rating: FsrsRating): Promise<void> => {
    const scheduled = input.services.scheduler.schedule.execute({
      rating,
      requestRetention: input.retention,
      target,
    });

    await input.services.progress.saveReviewTarget.execute({
      contentKey: target.contentKey || "",
      data: scheduled,
    });
  };
}
