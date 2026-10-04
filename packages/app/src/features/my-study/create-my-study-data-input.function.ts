import type { GetMyStudyDataInput } from "./get-my-study-data.function";
import type { MyStudyProgressQueries } from "./use-my-study-progress-queries.hook";
import type { CatalogReadModel } from "@guesant/saberes-application";

export type CreateMyStudyDataInput = {
  catalog: CatalogReadModel | undefined;
  date: Date;
  progress: MyStudyProgressQueries;
};

export function createMyStudyDataInput(input: CreateMyStudyDataInput): GetMyStudyDataInput {
  return {
    attempts: input.progress.attempts,
    catalog: input.catalog,
    reviews: input.progress.reviews,
    sessions: input.progress.sessions ?? [],
    streak: input.progress.streak,
    achievements: input.progress.achievements,
    topicMastery: input.progress.topicMastery,
    bookmarks: input.progress.bookmarks,
    date: input.date,
  };
}
