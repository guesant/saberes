import { gradeQuestionAnswer } from "@guesant/saberes-application";
import { syncStudyAchievements } from "../my-study/sync-study-achievements.function";
import { saveQuestionReviewTarget } from "./save-question-review-target.function";
import { syncQuestionMastery } from "./sync-question-mastery.function";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type {
  ApplicationServices,
  AttemptConfidence,
  QuestionReadModel,
} from "@guesant/saberes-application";

export type SubmitQuestionAnswerInput = {
  services: ApplicationServices;
  data: QuestionReadModel;
  answer: string;
  confidence: AttemptConfidence;
  elapsedMs: number;
};

export async function submitQuestionAnswer(
  input: SubmitQuestionAnswerInput,
): Promise<QuestionSubmissionResult> {
  const { confidence, data, answer, elapsedMs, services } = input;

  const { question } = data;

  const expected = String(question.correct_answer || "").toUpperCase();

  const isGradable = Boolean(question.is_automatically_gradable);

  const correct = gradeQuestionAnswer({
    answer,
    automaticallyGradable: isGradable,
    expectedAnswer: expected,
    questionType: String(question.type || "short_text"),
  });

  const contentKey = String(question.occurrence_key || `question:${question.occurrence_id}`);

  const attempt = await services.exercises.recordAttempt.execute({
    contentKey,
    questionId: String(question.occurrence_id),
    answer,
    confidence,
    elapsedMs,
    isCorrect: correct,
    topicIds: data.topics.map((topic) => String(topic.topic_id)),
  });

  await syncQuestionMastery({ services });

  await services.study.recordStudyActivity.execute({ type: "question" });

  await saveQuestionReviewTarget({ services, contentKey, correct });

  await syncStudyAchievements(services);

  return {
    attemptId: attempt.id || "",
    correct,
    confidence,
  };
}
