import type { ListAttemptsPort } from "../application.ports.ts";
import type { Attempt } from "../models/progress.models.ts";

export class ListAttemptsQueryHandler {
  public constructor(private readonly port: ListAttemptsPort) {}

  public execute(): Promise<Attempt[]> {
    return this.port.execute();
  }
}
