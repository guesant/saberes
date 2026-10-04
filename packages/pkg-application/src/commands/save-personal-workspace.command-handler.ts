import type { SavePersonalWorkspacePort } from "../ports/index";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export class SavePersonalWorkspaceCommandHandler {
  public constructor(private readonly port: SavePersonalWorkspacePort) {}

  public execute(workspace: PersonalWorkspace): Promise<PersonalWorkspace> {
    return this.port.execute(workspace);
  }
}
