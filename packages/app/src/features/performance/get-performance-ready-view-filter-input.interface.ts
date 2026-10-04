import type { PerformanceFilter } from "./performance-filter.interface";
import type { CatalogCard } from "@guesant/saberes-application";

export interface GetPerformanceReadyViewFilterInput {
  filter: PerformanceFilter;
  course: CatalogCard | undefined;
  plan: CatalogCard | undefined;
}
