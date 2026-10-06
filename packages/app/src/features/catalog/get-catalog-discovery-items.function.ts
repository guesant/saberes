import { getCatalogQuestionItems } from "./get-catalog-question-items.function";
import type { CatalogCard, CatalogReadModel } from "@guesant/saberes-application";

export interface GetCatalogDiscoveryItemsInput {
  catalog: CatalogReadModel;
  tab: number;
  mode: string | null;
}

export function getCatalogDiscoveryItems(input: GetCatalogDiscoveryItemsInput): CatalogCard[] {
  if (input.mode === "praticar" && input.tab === 3) {
    return getCatalogQuestionItems(input.catalog.content);
  }

  return [input.catalog.courses, input.catalog.maps, input.catalog.plans, input.catalog.content][input.tab] || [];
}
