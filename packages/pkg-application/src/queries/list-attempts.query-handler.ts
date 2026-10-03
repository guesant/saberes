import type { Attempt } from "../models/index.ts";
import type { ListAttemptsPort } from "../ports/index.ts";

export class ListAttemptsQueryHandler {
  public constructor(private readonly port: ListAttemptsPort) {}

  public execute(): Promise<Attempt[]> {
    return this.port.execute();
  }
}
