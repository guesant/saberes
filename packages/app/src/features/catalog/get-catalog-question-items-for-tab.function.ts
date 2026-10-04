import { getCatalogQuestionItems } from "./get-catalog-question-items.function";
import type { CatalogCard } from "@guesant/saberes-application";

export interface GetCatalogQuestionItemsForTabInput {
  items: CatalogCard[];
  tab: number;
}

export function getCatalogQuestionItemsForTab(
  input: GetCatalogQuestionItemsForTabInput,
): CatalogCard[] {
  if (input.tab !== 3) {
    return [];
  }

  return getCatalogQuestionItems(input.items);
}
