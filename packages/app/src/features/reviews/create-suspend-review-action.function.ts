import type { ApplicationServices, ReviewTarget } from "@guesant/saberes-application";

export type CreateSuspendReviewActionInput = {
  services: ApplicationServices;
};

export function createSuspendReviewAction(
  input: CreateSuspendReviewActionInput,
): (target: ReviewTarget) => Promise<void> {
  return async (target: ReviewTarget): Promise<void> => {
    await input.services.progress.saveReviewTarget.execute({
      contentKey: target.contentKey,
      data: {
        ...target,
        suspended: true,
      },
    });
  };
}
