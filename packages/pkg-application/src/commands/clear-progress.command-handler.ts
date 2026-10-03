import type { ClearProgressPort } from "../ports/index";

export class ClearProgressCommandHandler {
  public constructor(private readonly port: ClearProgressPort) {}

  public execute(): Promise<void> {
    return this.port.execute();
  }
}
