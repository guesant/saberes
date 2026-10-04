import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListStudyGoalsPort } from "@guesant/saberes-application";
import type { StudyGoal } from "@guesant/saberes-domain";

export class ListStudyGoalsAdapter implements ListStudyGoalsPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): Promise<StudyGoal[]> {
    return this.store.listStudyGoals();
  }
}
