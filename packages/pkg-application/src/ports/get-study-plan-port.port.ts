import type { StudyPlanReadModel } from "../models/index";

export interface GetStudyPlanPort {
  execute(slug?: string): Promise<StudyPlanReadModel>;
}
