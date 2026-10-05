import type { CreatePersonalRelationCommandInput } from "../models/create-personal-relation-command-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export interface CreatePersonalRelationPort {
  execute(input: CreatePersonalRelationCommandInput): Promise<PersonalWorkspace>;
}
