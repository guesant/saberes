import type { CatalogFilters, CatalogReadModel } from "../models/index.ts";

export interface GetCatalogPort {
  execute(filters?: CatalogFilters): Promise<CatalogReadModel>;
}
