import type { StudyGoal } from "@guesant/saberes-domain";

export interface ListStudyGoalsPort {
  execute(): Promise<StudyGoal[]>;
}
