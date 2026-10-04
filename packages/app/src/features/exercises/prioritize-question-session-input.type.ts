import type { Attempt, CatalogCard } from "@guesant/saberes-application";

export type PrioritizeQuestionSessionInput = {
  attempts: Attempt[];
  questions: CatalogCard[];
};
