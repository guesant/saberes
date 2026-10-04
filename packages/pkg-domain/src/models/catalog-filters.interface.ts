import type { LearningCourseType } from "./domain.enums";

export interface CatalogFilters {
  courseType?: LearningCourseType;
  processName?: string;
  search?: string;
  year?: number;
}
