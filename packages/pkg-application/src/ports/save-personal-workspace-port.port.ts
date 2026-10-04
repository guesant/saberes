import type { PersonalWorkspace } from "@guesant/saberes-domain";

export interface SavePersonalWorkspacePort {
  execute(workspace: PersonalWorkspace): Promise<PersonalWorkspace>;
}
