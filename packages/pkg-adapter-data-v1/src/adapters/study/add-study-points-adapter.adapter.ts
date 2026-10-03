import { addStudyPoints } from "../../services/add-study-points.service";
import type { AddStudyPointsPort } from "@guesant/saberes-application";

export class AddStudyPointsAdapter implements AddStudyPointsPort {
  public execute(
    input: Parameters<AddStudyPointsPort["execute"]>[0],
  ): ReturnType<AddStudyPointsPort["execute"]> {
    return addStudyPoints(input.amount, input.reason);
  }
}
