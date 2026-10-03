import type { Attempt } from "../models/index.ts";
import type { SaveAttemptPort } from "../ports/index.ts";

export class SaveAttemptCommandHandler {
  public constructor(private readonly port: SaveAttemptPort) {}

  public execute(attempt: Attempt): Promise<Attempt> {
    return this.port.execute(attempt);
  }
}
