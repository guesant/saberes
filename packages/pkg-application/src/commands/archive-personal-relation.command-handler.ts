import type { ArchivePersonalRelationCommandInput } from "../models/archive-personal-relation-command-input.interface";
import type { ArchivePersonalRelationPort } from "../ports/archive-personal-relation-port.port";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export class ArchivePersonalRelationCommandHandler {
  public constructor(private readonly port: ArchivePersonalRelationPort) {}

  public execute(input: ArchivePersonalRelationCommandInput): Promise<PersonalWorkspace> {
    return this.port.execute(input);
  }
}
