import type { ImportProgressInput } from "../models/index";
import type { ImportProgressPort } from "../ports/index";

export class ImportProgressCommandHandler {
  public constructor(private readonly port: ImportProgressPort) {}

  public execute(input: ImportProgressInput): Promise<void> {
    return this.port.execute(input);
  }
}
