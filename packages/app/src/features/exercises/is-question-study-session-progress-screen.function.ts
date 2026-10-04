import type { QuestionStudySessionScreen } from "./question-study-session-screen.type";

export function isQuestionStudySessionProgressScreen(screen: QuestionStudySessionScreen): boolean {
  return ["completed", "paused"].includes(screen);
}
