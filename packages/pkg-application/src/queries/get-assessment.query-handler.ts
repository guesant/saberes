import type { AssessmentReadModel } from "../models/index";
import type { GetAssessmentPort } from "../ports/index";
import type { ContentKey } from "@guesant/saberes-domain";

export class GetAssessmentQueryHandler {
  public constructor(private readonly port: GetAssessmentPort) {}

  public execute(key: ContentKey | string): Promise<AssessmentReadModel | null> {
    return this.port.execute(key);
  }
}
