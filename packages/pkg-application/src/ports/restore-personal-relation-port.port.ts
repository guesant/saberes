import type { RestorePersonalRelationCommandInput } from "../models/restore-personal-relation-command-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export interface RestorePersonalRelationPort {
  execute(input: RestorePersonalRelationCommandInput): Promise<PersonalWorkspace>;
}
