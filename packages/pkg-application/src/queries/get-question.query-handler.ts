import type { ContentKey, QuestionReadModel } from "../models/index.ts";
import type { GetQuestionPort } from "../ports/index.ts";

export class GetQuestionQueryHandler {
  public constructor(private readonly port: GetQuestionPort) {}

  public execute(key: ContentKey | string): Promise<QuestionReadModel | null> {
    return this.port.execute(key);
  }
}
