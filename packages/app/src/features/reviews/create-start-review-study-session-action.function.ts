import { startReviewStudySession } from "./start-review-study-session.function";
import type { StartReviewStudySessionInput } from "./start-review-study-session.function";

export function createStartReviewStudySessionAction(
  input: StartReviewStudySessionInput,
): () => Promise<void> {
  return (): Promise<void> => startReviewStudySession(input);
}
