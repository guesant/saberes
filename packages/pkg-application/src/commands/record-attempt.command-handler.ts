import type { Attempt } from "../models/index";
import type { RecordAttemptPort } from "../ports/index";

export class RecordAttemptCommandHandler {
  public constructor(private readonly port: RecordAttemptPort) {}

  public execute(attempt: Attempt): Promise<Attempt> {
    return this.port.execute(attempt);
  }
}
