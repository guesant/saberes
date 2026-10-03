import type { SaveAttemptPort } from "../application.ports.ts";
import type { Attempt } from "../models/progress.models.ts";

export class SaveAttemptCommandHandler {
  public constructor(private readonly port: SaveAttemptPort) {}

  public execute(attempt: Attempt): Promise<Attempt> {
    return this.port.execute(attempt);
  }
}
