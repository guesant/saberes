import type { DeleteSavedCatalogFilterPort } from "../ports/index";

export class DeleteSavedCatalogFilterCommandHandler {
  public constructor(private readonly port: DeleteSavedCatalogFilterPort) {}

  public execute(id: string): Promise<void> {
    return this.port.execute(id);
  }
}
