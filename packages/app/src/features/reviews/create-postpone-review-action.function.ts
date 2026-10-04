import { addDays } from "date-fns";
import type { ApplicationServices, ReviewTarget } from "@guesant/saberes-application";

export type CreatePostponeReviewActionInput = {
  services: ApplicationServices;
};

export function createPostponeReviewAction(
  input: CreatePostponeReviewActionInput,
): (target: ReviewTarget) => Promise<void> {
  return async (target: ReviewTarget): Promise<void> => {
    await input.services.progress.saveReviewTarget.execute({
      contentKey: target.contentKey,
      data: {
        ...target,
        dueAt: addDays(new Date(), 1).toISOString(),
        suspended: false,
      },
    });
  };
}
