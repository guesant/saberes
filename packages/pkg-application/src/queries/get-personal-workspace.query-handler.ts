import type { GetPersonalWorkspacePort } from "../ports/index";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export class GetPersonalWorkspaceQueryHandler {
  public constructor(private readonly port: GetPersonalWorkspacePort) {}

  public execute(): Promise<PersonalWorkspace> {
    return this.port.execute();
  }
}
