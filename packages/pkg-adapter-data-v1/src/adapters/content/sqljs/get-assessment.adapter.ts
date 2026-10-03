import { SqlJsContentRepository } from "./sql-js-content.repository";
import type { GetAssessmentPort } from "@guesant/saberes-application";

export class SqlJsGetAssessmentAdapter implements GetAssessmentPort {
  public constructor(private readonly store = new SqlJsContentRepository()) {}

  public execute(
    input: Parameters<GetAssessmentPort["execute"]>[0],
  ): ReturnType<GetAssessmentPort["execute"]> {
    return this.store.getAssessment(input);
  }
}
