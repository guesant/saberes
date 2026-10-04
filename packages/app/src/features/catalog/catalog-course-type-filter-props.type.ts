import type { LearningCourseType } from "@guesant/saberes-application";

export type CatalogCourseTypeFilterProps = {
  onChange(value: LearningCourseType | undefined): void;
  value?: LearningCourseType;
};
