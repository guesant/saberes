import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListDailyChallengesPort } from "@guesant/saberes-application";

export class ListDailyChallengesAdapter implements ListDailyChallengesPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<ListDailyChallengesPort["execute"]> {
    return this.store.listDailyChallenges();
  }
}
