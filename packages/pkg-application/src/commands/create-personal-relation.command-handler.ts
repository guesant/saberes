import type { CreatePersonalRelationCommandInput } from "../models/create-personal-relation-command-input.interface";
import type { CreatePersonalRelationPort } from "../ports/create-personal-relation-port.port";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export class CreatePersonalRelationCommandHandler {
  public constructor(private readonly port: CreatePersonalRelationPort) {}

  public execute(input: CreatePersonalRelationCommandInput): Promise<PersonalWorkspace> {
    return this.port.execute(input);
  }
}
