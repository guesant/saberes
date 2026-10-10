import type { LearningCourseType } from "./domain.enums";
import type { TrainingScope } from "./training-scope.interface";

export interface CatalogFilters {
  courseType?: LearningCourseType;
  processName?: string;
  search?: string;
  year?: number;
  trainingScope?: TrainingScope;
}
