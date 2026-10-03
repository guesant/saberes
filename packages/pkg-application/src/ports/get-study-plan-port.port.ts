import type { StudyPlanReadModel } from "../models/content.models.ts";

export interface GetStudyPlanPort {
  execute(slug?: string): Promise<StudyPlanReadModel>;
}
