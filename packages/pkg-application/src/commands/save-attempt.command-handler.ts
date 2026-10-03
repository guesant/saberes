import type { Attempt } from "../models/index";
import type { SaveAttemptPort } from "../ports/index";

export class SaveAttemptCommandHandler {
  public constructor(private readonly port: SaveAttemptPort) {}

  public execute(attempt: Attempt): Promise<Attempt> {
    return this.port.execute(attempt);
  }
}
