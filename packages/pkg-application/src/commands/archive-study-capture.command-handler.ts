import type { ArchiveStudyCapturePort } from "../ports/archive-study-capture-port.port";
import type { ArchiveStudyCaptureInput, PersonalWorkspace } from "@guesant/saberes-domain";

export class ArchiveStudyCaptureCommandHandler {
  public constructor(private readonly port: ArchiveStudyCapturePort) {}

  public execute(input: ArchiveStudyCaptureInput): Promise<PersonalWorkspace> {
    return this.port.execute(input);
  }
}
