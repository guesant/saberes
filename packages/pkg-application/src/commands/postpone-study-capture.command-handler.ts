import type { PostponeStudyCapturePort } from "../ports/postpone-study-capture-port.port";
import type { PersonalWorkspace, PostponeStudyCaptureInput } from "@guesant/saberes-domain";

export class PostponeStudyCaptureCommandHandler {
  public constructor(private readonly port: PostponeStudyCapturePort) {}

  public execute(input: PostponeStudyCaptureInput): Promise<PersonalWorkspace> {
    return this.port.execute(input);
  }
}
