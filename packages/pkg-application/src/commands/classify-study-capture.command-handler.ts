import type { ClassifyStudyCapturePort } from "../ports/classify-study-capture-port.port";
import type { ClassifyStudyCaptureInput, PersonalWorkspace } from "@guesant/saberes-domain";

export class ClassifyStudyCaptureCommandHandler {
  public constructor(private readonly port: ClassifyStudyCapturePort) {}

  public execute(input: ClassifyStudyCaptureInput): Promise<PersonalWorkspace> {
    return this.port.execute(input);
  }
}
