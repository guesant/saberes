import { addStudyPoints } from "../../services/add-study-points.service";
import type { ProgressStorageContract } from "../../storage/progress-storage.contract";
import type { AddStudyPointsPort } from "@guesant/saberes-application";

export class AddStudyPointsAdapter implements AddStudyPointsPort {
  public constructor(private readonly storage: ProgressStorageContract) {}

  public execute(
    input: Parameters<AddStudyPointsPort["execute"]>[0],
  ): ReturnType<AddStudyPointsPort["execute"]> {
    return addStudyPoints(this.storage, input.amount, input.reason);
  }
}
