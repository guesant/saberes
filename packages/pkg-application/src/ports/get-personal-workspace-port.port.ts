import type { PersonalWorkspace } from "@guesant/saberes-domain";

export interface GetPersonalWorkspacePort {
  execute(): Promise<PersonalWorkspace>;
}
