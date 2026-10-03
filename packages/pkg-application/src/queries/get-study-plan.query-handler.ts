import type { StudyPlanReadModel } from "../models/index";
import type { GetStudyPlanPort } from "../ports/index";

export class GetStudyPlanQueryHandler {
  public constructor(private readonly port: GetStudyPlanPort) {}

  public execute(slug?: string): Promise<StudyPlanReadModel> {
    return this.port.execute(slug);
  }
}
