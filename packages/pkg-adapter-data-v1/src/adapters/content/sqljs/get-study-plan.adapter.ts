import type { ContentRepositoryContract } from "./content-repository.contract";
import type { GetStudyPlanPort } from "@guesant/saberes-application";

export class SqlJsGetStudyPlanAdapter implements GetStudyPlanPort {
  public constructor(private readonly store: ContentRepositoryContract) {}

  public execute(
    input: Parameters<GetStudyPlanPort["execute"]>[0],
  ): ReturnType<GetStudyPlanPort["execute"]> {
    return this.store.getStudyPlan(input);
  }
}
