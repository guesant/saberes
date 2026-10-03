import type { GetStudyPlanPort } from "../application.ports.ts";
import type { StudyPlanReadModel } from "../models/content.models.ts";

export class GetStudyPlanQueryHandler {
  public constructor(private readonly port: GetStudyPlanPort) {}

  public execute(slug?: string): Promise<StudyPlanReadModel> {
    return this.port.execute(slug);
  }
}
