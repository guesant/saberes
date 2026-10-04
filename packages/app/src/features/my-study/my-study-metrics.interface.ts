import type { CatalogCard } from "@guesant/saberes-application";

export interface MyStudyMetrics {
  answered: number;
  correct: number;
  nextCourse: CatalogCard | null;
  reviews: number;
  streak: number;
  achievements: number;
  masteredTopics: number;
}
