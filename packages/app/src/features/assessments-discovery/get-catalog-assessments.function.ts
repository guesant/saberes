import { CatalogCardType } from "@guesant/saberes-application";
import type { CatalogCard } from "@guesant/saberes-application";

export function getCatalogAssessments(items: CatalogCard[]): CatalogCard[] {
  return items.filter((item) => {
    return item.type === CatalogCardType.Assessment;
  });
}
