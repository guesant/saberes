import type { PersonalProgressBuilderState } from "./personal-progress-builder-state.interface";
import type { PersonalProgressLink } from "./personal-progress-link.interface";

export function getPersonalProgressLink(
  state: PersonalProgressBuilderState,
  contentKey: string,
): PersonalProgressLink {
  const existing = state.links.get(contentKey);

  if (existing) {
    return existing;
  }

  const link: PersonalProgressLink = {
    activityIds: [],
    attemptCount: 0,
    contentKey,
    correctAttemptCount: 0,
    completedSessionCount: 0,
    goalContentKeys: [],
    questionKeys: [],
    sessionIds: [],
    topicKeys: [],
  };

  state.links.set(contentKey, link);

  return link;
}
