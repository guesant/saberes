import type { QuestionSessionProgress } from "./get-question-session-progress.function";

export function getQuestionSessionPercentage(
  progress: Pick<QuestionSessionProgress, "answered" | "total">,
): number {
  return progress.total ? Math.round((progress.answered / progress.total) * 100) : 0;
}
