import type { CatalogCard } from "@guesant/saberes-domain";

export interface CatalogReadModel {
  courses: CatalogCard[];
  maps: CatalogCard[];
  plans: CatalogCard[];
  content: CatalogCard[];
}
