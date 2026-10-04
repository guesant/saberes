import { startReviewStudySession } from "./start-review-study-session.function";
import type { StartReviewStudySessionInput } from "./start-review-study-session.function";
import type { AsyncAction } from "../../types/async-action.type";

export function createStartReviewStudySessionAction(
  input: StartReviewStudySessionInput,
): AsyncAction<[], string | null> {
  return (): Promise<string | null> => {
    return startReviewStudySession(input);
  };
}
