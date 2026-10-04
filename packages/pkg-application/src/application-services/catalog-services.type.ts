import type { GetCatalogQueryHandler } from "../queries/get-catalog.query-handler";

export type CatalogServices = {
  get: GetCatalogQueryHandler;
};
