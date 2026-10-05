import { addPersonalProgressValue } from "./add-personal-progress-value.function";
import { getPersonalProgressLink } from "./get-personal-progress-link.function";
import type { PersonalProgressBuilderState } from "./personal-progress-builder-state.interface";
import type { PersonalActivity } from "@guesant/saberes-application";

export function addPersonalProgressActivity(
  state: PersonalProgressBuilderState,
  activity: PersonalActivity,
): void {
  if (!activity.contentKey) {
    state.unlinkedActivityIds.push(activity.id);

    return;
  }

  const link = getPersonalProgressLink(state, activity.contentKey);

  addPersonalProgressValue(link.activityIds, activity.id);
}
