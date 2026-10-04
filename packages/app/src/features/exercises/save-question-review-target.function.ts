import {
  ReviewState,
  ReviewTargetType,
  type ApplicationServices,
} from "@guesant/saberes-application";

export type SaveQuestionReviewTargetInput = {
  services: ApplicationServices;
  contentKey: string;
  correct: boolean | null;
};

export async function saveQuestionReviewTarget(
  input: SaveQuestionReviewTargetInput,
): Promise<void> {
  if (input.correct === true) {
    return;
  }

  await input.services.progress.saveReviewTarget.execute({
    contentKey: input.contentKey,
    data: {
      state: ReviewState.New,
      targetType: ReviewTargetType.Question,
      suspended: false,
    },
  });
}
