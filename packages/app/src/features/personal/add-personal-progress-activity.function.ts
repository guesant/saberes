import { getContentReferenceKey } from "@guesant/saberes-application";
import { addPersonalProgressValue } from "./add-personal-progress-value.function";
import { getPersonalProgressLink } from "./get-personal-progress-link.function";
import type { PersonalProgressBuilderState } from "./personal-progress-builder-state.interface";
import type { PersonalActivity } from "@guesant/saberes-application";

export function addPersonalProgressActivity(
  state: PersonalProgressBuilderState,
  activity: PersonalActivity,
): void {
  const contentKey = getContentReferenceKey(activity.contentReference);

  if (!contentKey) {
    state.unlinkedActivityIds.push(activity.id);

    return;
  }

  const link = getPersonalProgressLink(state, contentKey);

  addPersonalProgressValue(link.activityIds, activity.id);
}
