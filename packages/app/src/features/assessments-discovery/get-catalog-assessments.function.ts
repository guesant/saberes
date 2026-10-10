import { CatalogCardType } from "@guesant/saberes-application";
import type { CatalogCard } from "@guesant/saberes-application";

export function getCatalogAssessments(items: CatalogCard[]): CatalogCard[] {
  return items.filter((item) => {
    return item.type === CatalogCardType.Assessment ||
      (item.type === CatalogCardType.Resource &&
        item.year !== undefined &&
        item.year >= 2025 &&
        item.year <= 2027 &&
        (item.resourceKind?.startsWith("official_") || item.resourceKind === "regulation" ||
          item.resourceKind === "consolidated_regulation" || item.resourceKind === "regulation_amendment"));
  });
}
