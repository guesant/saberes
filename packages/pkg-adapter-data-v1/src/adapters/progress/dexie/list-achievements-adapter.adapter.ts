import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListAchievementsPort } from "@guesant/saberes-application";

export class ListAchievementsAdapter implements ListAchievementsPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ListAchievementsPort["execute"]> {
    return this.store.listAchievements();
  }
}
