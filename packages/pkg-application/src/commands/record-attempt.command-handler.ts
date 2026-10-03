import type { Attempt } from "../models/index.ts";
import type { RecordAttemptPort } from "../ports/index.ts";

export class RecordAttemptCommandHandler {
  public constructor(private readonly port: RecordAttemptPort) {}

  public execute(attempt: Attempt): Promise<Attempt> {
    return this.port.execute(attempt);
  }
}
