import { getCatalogCardPath } from "./get-catalog-card-path.function";
import type { CatalogReadModel } from "@guesant/saberes-application";
import type { CommandPaletteEntry } from "@guesant/saberes-ui";

export function getCatalogCommandPaletteItems(
  catalog: CatalogReadModel | undefined,
): CommandPaletteEntry[] {
  if (!catalog) {
    return [];
  }

  const cards = [...catalog.courses, ...catalog.maps, ...catalog.plans, ...catalog.content];

  return cards.map((card) => ({
    description: card.meta || card.description,
    id: `catalog:${card.type}:${card.id}`,
    label: card.title,
    value: getCatalogCardPath(card),
  }));
}
