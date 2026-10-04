import type { SavePlanProgressCommandHandler } from "../commands/save-plan-progress.command-handler";
import type { GetStudyPlanQueryHandler } from "../queries/get-study-plan.query-handler";

export type StudyPlanServices = {
  get: GetStudyPlanQueryHandler;
  saveProgress: SavePlanProgressCommandHandler;
};
