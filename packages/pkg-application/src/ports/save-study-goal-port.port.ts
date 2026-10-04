import type { StudyGoal } from "@guesant/saberes-domain";

export interface SaveStudyGoalPort {
  execute(goal: StudyGoal): Promise<StudyGoal>;
}
