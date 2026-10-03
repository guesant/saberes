import type { Attempt } from "../models/index";
import type { ListAttemptsPort } from "../ports/index";

export class ListAttemptsQueryHandler {
  public constructor(private readonly port: ListAttemptsPort) {}

  public execute(): Promise<Attempt[]> {
    return this.port.execute();
  }
}
