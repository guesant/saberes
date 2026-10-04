import type { ExportProgressPort } from "../ports/index";

export class ExportProgressQueryHandler {
  public constructor(private readonly port: ExportProgressPort) {}

  public execute(): Promise<string> {
    return this.port.execute();
  }
}
