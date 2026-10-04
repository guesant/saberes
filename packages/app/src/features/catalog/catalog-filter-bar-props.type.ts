import type { CatalogFilters } from "@guesant/saberes-application";

export type CatalogFilterBarProps = {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
};
