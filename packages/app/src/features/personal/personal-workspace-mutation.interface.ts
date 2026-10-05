import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface PersonalWorkspaceMutation {
  mutateAsync(workspace: PersonalWorkspace): Promise<PersonalWorkspace>;
}
