import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export function deletePersonalLens(workspace: PersonalWorkspace, id: string): PersonalWorkspace {
  return {
    ...workspace,
    lenses: (workspace.lenses ?? []).filter((lens) => {
      return lens.id !== id;
    }),
  };
}
