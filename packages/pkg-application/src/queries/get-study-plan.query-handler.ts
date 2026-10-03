import type { StudyPlanReadModel } from "../models/index.ts";
import type { GetStudyPlanPort } from "../ports/index.ts";

export class GetStudyPlanQueryHandler {
  public constructor(private readonly port: GetStudyPlanPort) {}

  public execute(slug?: string): Promise<StudyPlanReadModel> {
    return this.port.execute(slug);
  }
}
