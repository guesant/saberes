import type { CatalogFilters, CatalogReadModel } from "../models/index.ts";
import type { GetCatalogPort } from "../ports/index.ts";

export class GetCatalogQueryHandler {
  public constructor(private readonly port: GetCatalogPort) {}

  public execute(filters?: CatalogFilters): Promise<CatalogReadModel> {
    return this.port.execute(filters);
  }
}
