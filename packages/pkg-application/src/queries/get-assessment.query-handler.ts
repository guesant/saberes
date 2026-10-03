import type { AssessmentReadModel, ContentKey } from "../models/index.ts";
import type { GetAssessmentPort } from "../ports/index.ts";

export class GetAssessmentQueryHandler {
  public constructor(private readonly port: GetAssessmentPort) {}

  public execute(key: ContentKey | string): Promise<AssessmentReadModel | null> {
    return this.port.execute(key);
  }
}
