import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { GetStreakPort } from "@guesant/saberes-application";

export class GetStreakAdapter implements GetStreakPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(): ReturnType<GetStreakPort["execute"]> {
    return this.store.getStreak();
  }
}
