import type { RestorePersonalRelationCommandInput } from "../models/restore-personal-relation-command-input.interface";
import type { RestorePersonalRelationPort } from "../ports/restore-personal-relation-port.port";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export class RestorePersonalRelationCommandHandler {
  public constructor(private readonly port: RestorePersonalRelationPort) {}

  public execute(input: RestorePersonalRelationCommandInput): Promise<PersonalWorkspace> {
    return this.port.execute(input);
  }
}
