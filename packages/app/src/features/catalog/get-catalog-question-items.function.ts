import type { CatalogCard } from "@guesant/saberes-application";

export function getCatalogQuestionItems(items: CatalogCard[]): CatalogCard[] {
  return items.filter((item) => {
    return item.type === "question";
  });
}
