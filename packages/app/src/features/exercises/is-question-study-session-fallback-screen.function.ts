import type { QuestionStudySessionScreen } from "./question-study-session-screen.type";

export function isQuestionStudySessionFallbackScreen(screen: QuestionStudySessionScreen): boolean {
  return ["loading", "error", "not-found"].includes(screen);
}
