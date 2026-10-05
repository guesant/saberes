import type { UndoStudyCapturePort } from "../ports/undo-study-capture-port.port";
import type { PersonalWorkspace, UndoStudyCaptureInput } from "@guesant/saberes-domain";

export class UndoStudyCaptureCommandHandler {
  public constructor(private readonly port: UndoStudyCapturePort) {}

  public execute(input: UndoStudyCaptureInput): Promise<PersonalWorkspace> {
    return this.port.execute(input);
  }
}
