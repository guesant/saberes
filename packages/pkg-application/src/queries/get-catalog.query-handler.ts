import type { CatalogReadModel } from "../models/index";
import type { GetCatalogPort } from "../ports/index";
import type { CatalogFilters } from "@guesant/saberes-domain";

export class GetCatalogQueryHandler {
  public constructor(private readonly port: GetCatalogPort) {}

  public execute(filters?: CatalogFilters): Promise<CatalogReadModel> {
    return this.port.execute(filters);
  }
}
