import type { QuestionStudySessionScreenOption } from "./question-study-session-screen-option.interface";
import type { QuestionStudySessionScreen } from "./question-study-session-screen.type";

export interface GetQuestionStudySessionScreenInput {
  sessionState: "loading" | "error" | "ready";
  hasSession: boolean;
  completed: boolean;
  paused: boolean;
  questionState: "loading" | "error" | "ready";
  hasQuestion: boolean;
}

export function getQuestionStudySessionScreen(
  input: GetQuestionStudySessionScreenInput,
): QuestionStudySessionScreen {
  const screens: QuestionStudySessionScreenOption[] = [
    { enabled: input.sessionState === "loading", screen: "loading" },
    { enabled: input.sessionState === "error", screen: "error" },
    { enabled: !input.hasSession, screen: "not-found" },
    { enabled: input.completed, screen: "completed" },
    { enabled: input.paused, screen: "paused" },
    { enabled: input.questionState === "loading", screen: "question-loading" },
    { enabled: input.questionState === "error", screen: "question-error" },
    { enabled: !input.hasQuestion, screen: "question-not-found" },
    { enabled: true, screen: "question" },
  ];

  return screens.find((item) => item.enabled)?.screen || "question";
}
