import type { SavedCatalogFilter } from "../models/index";
import type { SaveSavedCatalogFilterPort } from "../ports/index";

export class SaveSavedCatalogFilterCommandHandler {
  public constructor(private readonly port: SaveSavedCatalogFilterPort) {}

  public execute(input: SavedCatalogFilter): Promise<void> {
    return this.port.execute(input);
  }
}
