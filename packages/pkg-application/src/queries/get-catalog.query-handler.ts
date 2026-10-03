import type { GetCatalogPort } from "../application.ports.ts";
import type { CatalogFilters, CatalogReadModel } from "../models/content.models.ts";

export class GetCatalogQueryHandler {
  public constructor(private readonly port: GetCatalogPort) {}

  public execute(filters?: CatalogFilters): Promise<CatalogReadModel> {
    return this.port.execute(filters);
  }
}
