import { SqlJsContentRepository } from "./sql-js-content.repository";
import type { GetQuestionPort } from "@guesant/saberes-application";

export class SqlJsGetQuestionAdapter implements GetQuestionPort {
  public constructor(private readonly store = new SqlJsContentRepository()) {}

  public execute(
    input: Parameters<GetQuestionPort["execute"]>[0],
  ): ReturnType<GetQuestionPort["execute"]> {
    return this.store.getQuestion(input);
  }
}
