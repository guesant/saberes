import { addPersonalProgressGoal } from "./add-personal-progress-goal.function";
import type { PersonalProgressBuilderState } from "./personal-progress-builder-state.interface";
import type { StudyGoal } from "@guesant/saberes-application";

export function addPersonalProgressGoalEvidence(
  state: PersonalProgressBuilderState,
  goals: StudyGoal[],
): void {
  for (const goal of goals) {
    addPersonalProgressGoal(state, goal);
  }
}
