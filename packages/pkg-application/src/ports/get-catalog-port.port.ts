import type { CatalogReadModel } from "../models/index";
import type { CatalogFilters } from "@guesant/saberes-domain";

export interface GetCatalogPort {
  execute(filters?: CatalogFilters): Promise<CatalogReadModel>;
}
