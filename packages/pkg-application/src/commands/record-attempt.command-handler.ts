import type { RecordAttemptPort } from "../application.ports.ts";
import type { Attempt } from "../models/progress.models.ts";

export class RecordAttemptCommandHandler {
  public constructor(private readonly port: RecordAttemptPort) {}

  public execute(attempt: Attempt): Promise<Attempt> {
    return this.port.execute(attempt);
  }
}
