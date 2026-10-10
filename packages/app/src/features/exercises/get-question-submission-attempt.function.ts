import { getQuestionAttemptContentKey } from "./get-question-attempt-content-key.function";
import type { SubmitQuestionAnswerInput } from "./submit-question-answer.function";
import type { Attempt } from "@guesant/saberes-application";

export function getQuestionSubmissionAttempt(
  input: SubmitQuestionAnswerInput,
  correct: boolean | null,
): Attempt {
  const { question } = input.data;

  return {
    contentKey: getQuestionAttemptContentKey(question),
    questionId: question.occurrence_id ?? getQuestionAttemptContentKey(question),
    canonicalQuestionKey: question.canonical_key,
    canonicalQuestionId: question.question_id,
    questionContentVersion: question.editorial_version,
    answerKeyVersion: String(question.answer_key_version ?? "") || undefined,
    sourceEditionKey: question.source_edition_slug,
    sourceStageKey: question.source_stage_slug,
    occurrenceKey: question.occurrence_key,
    answer: input.answer,
    confidence: input.confidence,
    elapsedMs: input.elapsedMs,
    isCorrect: correct,
    sessionId: input.sessionId,
    topicIds: input.data.topics.map((topic) => {
      return String(topic.topic_id);
    }),
    subjectIds: input.data.subjectIds,
    skillIds: input.data.skills?.map((skill) => {
      return skill.id;
    }),
  };
}
