import type { QuestionReadModel } from "../models/index";
import type { GetQuestionPort } from "../ports/index";
import type { ContentKey } from "@guesant/saberes-domain";

export class GetQuestionQueryHandler {
  public constructor(private readonly port: GetQuestionPort) {}

  public execute(key: ContentKey | string): Promise<QuestionReadModel | null> {
    return this.port.execute(key);
  }
}
