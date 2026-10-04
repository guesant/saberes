import { startQuestionStudySession } from "./start-question-study-session.function";
import type { StartQuestionStudySessionInput } from "./start-question-study-session.function";
import type { AsyncAction } from "../../types/async-action.type";

export function createStartQuestionStudySessionAction(
  input: StartQuestionStudySessionInput,
): AsyncAction<[], void> {
  return (): Promise<void> => {
    return startQuestionStudySession(input);
  };
}
