import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface PersonalWorkspaceActionsInput {
  workspace: PersonalWorkspace;
  save(workspace: PersonalWorkspace): Promise<void>;

  generateId(): string;
}
