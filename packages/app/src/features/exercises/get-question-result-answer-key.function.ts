import type { QuestionReadModel } from "@guesant/saberes-application";

export function getQuestionResultAnswerKey(data: QuestionReadModel, correct: boolean | null): string {
  if (correct !== false) {
    return "";
  }

  return String(data.question.correct_answer || "");
}
