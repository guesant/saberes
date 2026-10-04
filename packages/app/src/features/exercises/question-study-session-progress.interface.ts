import type { QuestionSessionProgress } from "./get-question-session-progress.function";

export interface QuestionStudySessionProgress extends QuestionSessionProgress {
  currentIndex: number;
}
