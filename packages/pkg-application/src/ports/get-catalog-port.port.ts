import type { CatalogFilters, CatalogReadModel } from "../models/content.models.ts";

export interface GetCatalogPort {
  execute(filters?: CatalogFilters): Promise<CatalogReadModel>;
}
