import type { AddStudyPointsInput, AddStudyPointsResult } from "../models/index";

export interface AddStudyPointsPort {
  execute(input: AddStudyPointsInput): Promise<AddStudyPointsResult>;
}
