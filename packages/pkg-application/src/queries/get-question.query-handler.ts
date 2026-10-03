import type { GetQuestionPort } from "../application.ports.ts";
import type { ContentKey, QuestionReadModel } from "../models/content.models.ts";

export class GetQuestionQueryHandler {
  public constructor(private readonly port: GetQuestionPort) {}

  public execute(key: ContentKey | string): Promise<QuestionReadModel | null> {
    return this.port.execute(key);
  }
}
