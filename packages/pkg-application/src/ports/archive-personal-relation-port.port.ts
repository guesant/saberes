import type { ArchivePersonalRelationCommandInput } from "../models/archive-personal-relation-command-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

export interface ArchivePersonalRelationPort {
  execute(input: ArchivePersonalRelationCommandInput): Promise<PersonalWorkspace>;
}
