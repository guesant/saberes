import { addPersonalProgressValue } from "./add-personal-progress-value.function";
import { getPersonalProgressLink } from "./get-personal-progress-link.function";
import type { AddPersonalProgressAttemptLinkInput } from "./add-personal-progress-attempt-link-input.interface";

export function addPersonalProgressAttemptLink(
  input: AddPersonalProgressAttemptLinkInput,
): void {
  const link = getPersonalProgressLink(input.state, input.attemptKey);

  link.attemptCount += 1;

  if (input.attempt.isCorrect === true) {
    link.correctAttemptCount += 1;
  }

  if (input.attemptKey.startsWith("question:")) {
    addPersonalProgressValue(link.questionKeys, input.attemptKey);
  }

  if (input.attempt.sessionId) {
    addPersonalProgressValue(link.sessionIds, input.attempt.sessionId);
  }
}
