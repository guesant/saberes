import { startQuestionStudySession } from "./start-question-study-session.function";
import type { StartQuestionStudySessionInput } from "./start-question-study-session.function";

export function createStartQuestionStudySessionAction(
  input: StartQuestionStudySessionInput,
): () => Promise<void> {
  return (): Promise<void> => startQuestionStudySession(input);
}
