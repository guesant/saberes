import type { ContentRepositoryContract } from "./content-repository.contract";
import type { GetAssessmentPort } from "@guesant/saberes-application";

export class SqlJsGetAssessmentAdapter implements GetAssessmentPort {
  public constructor(private readonly store: ContentRepositoryContract) {}

  public execute(
    input: Parameters<GetAssessmentPort["execute"]>[0],
  ): ReturnType<GetAssessmentPort["execute"]> {
    return this.store.getAssessment(input);
  }
}
