import { addPersonalProgressValue } from "./add-personal-progress-value.function";
import { getPersonalProgressLink } from "./get-personal-progress-link.function";
import type { PersonalProgressBuilderState } from "./personal-progress-builder-state.interface";
import type { StudyGoal } from "@guesant/saberes-application";

export function addPersonalProgressGoal(state: PersonalProgressBuilderState, goal: StudyGoal): void {
  const link = getPersonalProgressLink(state, goal.contentKey);

  addPersonalProgressValue(link.goalContentKeys, goal.contentKey);
}
