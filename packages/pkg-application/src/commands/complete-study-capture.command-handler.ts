import type { CompleteStudyCapturePort } from "../ports/complete-study-capture-port.port";
import type { CompleteStudyCaptureInput, PersonalWorkspace } from "@guesant/saberes-domain";

export class CompleteStudyCaptureCommandHandler {
  public constructor(private readonly port: CompleteStudyCapturePort) {}

  public execute(input: CompleteStudyCaptureInput): Promise<PersonalWorkspace> {
    return this.port.execute(input);
  }
}
