import { syncStudyAchievements } from "../my-study/sync-study-achievements.function";
import { saveQuestionReviewTarget } from "./save-question-review-target.function";
import { syncQuestionMastery } from "./sync-question-mastery.function";
import type { SyncQuestionSubmissionInput } from "./sync-question-submission-input.interface";

export async function syncQuestionSubmission(input: SyncQuestionSubmissionInput): Promise<void> {
  await syncQuestionMastery({ services: input.services });

  await input.services.study.recordStudyActivity.execute({ type: "question" });

  await saveQuestionReviewTarget({
    services: input.services,
    contentKey: input.contentKey,
    correct: input.correct,
  });

  await syncStudyAchievements(input.services);
}
