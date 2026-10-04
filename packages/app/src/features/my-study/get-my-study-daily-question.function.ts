import { selectDailyQuestion } from "./select-daily-question.function";
import type { CatalogReadModel } from "@guesant/saberes-application";

export function getMyStudyDailyQuestion(catalog: CatalogReadModel | undefined, date: Date) {
  return selectDailyQuestion({ content: catalog ? catalog.content : [], date });
}
