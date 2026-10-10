import { gradeQuestionAnswer } from "@guesant/saberes-application";
import { getQuestionAttemptContentKey } from "./get-question-attempt-content-key.function";
import { getQuestionSubmissionAttempt } from "./get-question-submission-attempt.function";
import { syncQuestionSubmission } from "./sync-question-submission.function";
import { validateQuestionTrainingEligible } from "./validate-question-training-eligible.function";
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
  sessionId?: string;
};

export async function submitQuestionAnswer(
  input: SubmitQuestionAnswerInput,
): Promise<QuestionSubmissionResult> {
  validateQuestionTrainingEligible(input.data);

  const { confidence, data, answer, services } = input;

  const { question } = data;

  const expected = String(question.correct_answer ?? "")
    .toUpperCase();

  const correct = gradeQuestionAnswer({
    answer,
    automaticallyGradable: Boolean(question.is_automatically_gradable),
    expectedAnswer: expected,
    questionType: String(question.type ?? "short_text"),
  });

  const contentKey = getQuestionAttemptContentKey(question);

  const attempt = await services.exercises.recordAttempt.execute(
    getQuestionSubmissionAttempt(input, correct),
  );

  await syncQuestionSubmission({ services, contentKey, correct });

  return {
    attemptId: attempt.id || "",
    correct,
    confidence,
  };
}
