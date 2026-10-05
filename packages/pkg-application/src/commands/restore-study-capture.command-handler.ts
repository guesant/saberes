import type { RestoreStudyCapturePort } from "../ports/restore-study-capture-port.port";
import type { PersonalWorkspace, RestoreStudyCaptureInput } from "@guesant/saberes-domain";

export class RestoreStudyCaptureCommandHandler {
  public constructor(private readonly port: RestoreStudyCapturePort) {}

  public execute(input: RestoreStudyCaptureInput): Promise<PersonalWorkspace> {
    return this.port.execute(input);
  }
}
