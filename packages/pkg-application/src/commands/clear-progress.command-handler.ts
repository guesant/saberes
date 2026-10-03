import type { ClearProgressPort } from "../application.ports.ts";

export class ClearProgressCommandHandler {
  public constructor(private readonly port: ClearProgressPort) {}

  public execute(): Promise<void> {
    return this.port.execute();
  }
}
