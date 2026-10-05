import { addPersonalProgressValue } from "./add-personal-progress-value.function";
import { getPersonalProgressLink } from "./get-personal-progress-link.function";
import type { AddPersonalProgressTopicEvidenceInput } from "./add-personal-progress-topic-evidence-input.interface";

export function addPersonalProgressTopicEvidence(
  input: AddPersonalProgressTopicEvidenceInput,
): void {
  const topicKey = `topic:${String(input.topicId)}`;

  const topicLink = getPersonalProgressLink(input.state, topicKey);

  addPersonalProgressValue(topicLink.topicKeys, topicKey);

  addPersonalProgressValue(topicLink.questionKeys, input.attemptKey);

  topicLink.attemptCount += 1;

  if (input.isCorrect === true) {
    topicLink.correctAttemptCount += 1;
  }

  if (input.sessionId) {
    addPersonalProgressValue(topicLink.sessionIds, input.sessionId);
  }
}
