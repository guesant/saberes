import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { SaveStudyGoalPort } from "@guesant/saberes-application";
import type { StudyGoal } from "@guesant/saberes-domain";

export class SaveStudyGoalAdapter implements SaveStudyGoalPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(goal: StudyGoal): Promise<StudyGoal> {
    return this.store.saveStudyGoal(goal);
  }
}
