import type { ContentRepositoryContract } from "./content-repository.contract";
import type { GetQuestionPort } from "@guesant/saberes-application";

export class SqlJsGetQuestionAdapter implements GetQuestionPort {
  public constructor(private readonly store: ContentRepositoryContract) {}

  public execute(
    input: Parameters<GetQuestionPort["execute"]>[0],
    scope?: Parameters<GetQuestionPort["execute"]>[1],
  ): ReturnType<GetQuestionPort["execute"]> {
    return this.store.getQuestion(input, scope);
  }
}
