import { addPersonalProgressAttemptLink } from "./add-personal-progress-attempt-link.function";
import { addPersonalProgressTopicEvidence } from "./add-personal-progress-topic-evidence.function";
import { getPersonalProgressAttemptId } from "./get-personal-progress-attempt-id.function";
import { getPersonalProgressAttemptKey } from "./get-personal-progress-attempt-key.function";
import type { PersonalProgressBuilderState } from "./personal-progress-builder-state.interface";
import type { Attempt } from "@guesant/saberes-application";

export function addPersonalProgressAttempt(
  state: PersonalProgressBuilderState,
  attempt: Attempt,
  attemptIndex: number,
): void {
  const attemptKey = getPersonalProgressAttemptKey(attempt);

  const attemptId = getPersonalProgressAttemptId(attempt, attemptIndex);

  if (!attemptKey) {
    state.unlinkedAttemptIds.push(attemptId);

    return;
  }

  addPersonalProgressAttemptLink({ attempt, attemptKey, state });

  for (const topicId of attempt.topicIds ?? []) {
    addPersonalProgressTopicEvidence({
      attemptKey,
      isCorrect: attempt.isCorrect,
      sessionId: attempt.sessionId,
      state,
      topicId,
    });
  }
}
