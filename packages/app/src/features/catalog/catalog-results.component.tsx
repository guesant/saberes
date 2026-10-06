import { CatalogEmptyState } from "./catalog-empty-state.component";
import { CatalogGrid } from "./catalog-grid.component";
import type { CatalogCard } from "@guesant/saberes-application";

export interface CatalogResultsProps {
  items: CatalogCard[];
}

export function CatalogResults(props: CatalogResultsProps) {
  if (!props.items.length) {
    return <CatalogEmptyState />;
  }

  return <CatalogGrid items={props.items} />;
}
