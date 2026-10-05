import { addPersonalProgressAttempt } from "./add-personal-progress-attempt.function";
import type { PersonalProgressBuilderState } from "./personal-progress-builder-state.interface";
import type { Attempt } from "@guesant/saberes-application";

export function addPersonalProgressAttemptEvidence(
  state: PersonalProgressBuilderState,
  attempts: Attempt[],
): void {
  for (const [attemptIndex, attempt] of attempts.entries()) {
    addPersonalProgressAttempt(state, attempt, attemptIndex);
  }
}
