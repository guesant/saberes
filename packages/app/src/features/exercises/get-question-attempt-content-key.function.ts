import type { QuestionDetailsReadModel } from "@guesant/saberes-application";

export function getQuestionAttemptContentKey(question: QuestionDetailsReadModel): string {
  const key = [question.occurrence_key, question.canonical_key, `question:${question.occurrence_id}`]
    .find((candidate) => { return Boolean(candidate); });

  return String(key ?? "");
}
