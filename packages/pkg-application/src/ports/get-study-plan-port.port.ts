import type { StudyPlanReadModel } from "../models/index.ts";

export interface GetStudyPlanPort {
  execute(slug?: string): Promise<StudyPlanReadModel>;
}
