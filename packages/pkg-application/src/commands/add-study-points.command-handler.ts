import type { AddStudyPointsInput, AddStudyPointsResult } from "../models/index";
import type { AddStudyPointsPort } from "../ports/index";

export class AddStudyPointsCommandHandler {
  public constructor(private readonly port: AddStudyPointsPort) {}

  public execute(input: AddStudyPointsInput): Promise<AddStudyPointsResult> {
    return this.port.execute(input);
  }
}
