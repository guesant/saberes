import { addPersonalProgressActivity } from "./add-personal-progress-activity.function";
import type { PersonalProgressBuilderState } from "./personal-progress-builder-state.interface";
import type { PersonalActivity } from "@guesant/saberes-application";

export function addPersonalProgressActivityEvidence(
  state: PersonalProgressBuilderState,
  activities: PersonalActivity[],
): void {
  for (const activity of activities) {
    addPersonalProgressActivity(state, activity);
  }
}
