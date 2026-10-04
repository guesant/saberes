import { getQuestionAttempt } from "./get-question-attempt.function";
import { getQuestionPriority } from "./get-question-priority.function";
import type { PrioritizeQuestionSessionInput } from "./prioritize-question-session-input.type";
import type { CatalogCard } from "@guesant/saberes-application";

export function getPrioritizedQuestionSessionQuestions(
  input: PrioritizeQuestionSessionInput,
): CatalogCard[] {
  return input.questions
    .map((question, index) => ({
      index,
      priority: getQuestionPriority(getQuestionAttempt(question, input.attempts)),
      question,
    }))
    .sort((left, right) => left.priority - right.priority || left.index - right.index)
    .map((item) => item.question);
}
