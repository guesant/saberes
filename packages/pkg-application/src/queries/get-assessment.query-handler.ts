import type { GetAssessmentPort } from "../application.ports.ts";
import type { AssessmentReadModel, ContentKey } from "../models/content.models.ts";

export class GetAssessmentQueryHandler {
  public constructor(private readonly port: GetAssessmentPort) {}

  public execute(key: ContentKey | string): Promise<AssessmentReadModel | null> {
    return this.port.execute(key);
  }
}
