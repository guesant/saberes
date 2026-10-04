import type { PerformanceScope } from "./performance-scope.type";
import type { CatalogCard } from "@guesant/saberes-application";

export function getPerformanceScopeKey(
  scope: PerformanceScope,
  course: CatalogCard | undefined,
  plan: CatalogCard | undefined,
): string | undefined {
  const cards: Partial<Record<PerformanceScope, CatalogCard>> = { course, plan };

  const card = cards[scope];

  return card ? `${scope}:${card.slug || card.id}` : undefined;
}
