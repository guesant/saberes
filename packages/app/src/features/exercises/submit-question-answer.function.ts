import { gradeQuestionAnswer } from "@guesant/saberes-application";
import { getQuestionAttemptContentKey } from "./get-question-attempt-content-key.function";
import { syncQuestionSubmission } from "./sync-question-submission.function";
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
  const { confidence, data, answer, elapsedMs, services, sessionId } = input;

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

  const attempt = await services.exercises.recordAttempt.execute({
    contentKey,
    questionId: question.occurrence_id ?? contentKey,
    canonicalQuestionKey: question.canonical_key,
    occurrenceKey: question.occurrence_key,
    answer,
    confidence,
    elapsedMs,
    isCorrect: correct,
    sessionId,
    topicIds: data.topics.map((topic) => { return String(topic.topic_id); }),
  });

  await syncQuestionSubmission({ services, contentKey, correct });

  return {
    attemptId: attempt.id || "",
    correct,
    confidence,
  };
}
