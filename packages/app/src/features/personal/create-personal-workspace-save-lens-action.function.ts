import { createPersonalLens, savePersonalLens } from "@guesant/saberes-application";
import type { PersonalLensSaveAction } from "./personal-lens-save-action.type";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { SavePersonalLensInput } from "./save-personal-lens-input.interface";

export function createPersonalWorkspaceSaveLensAction(
  input: PersonalWorkspaceActionsInput,
): PersonalLensSaveAction {
  return async (lensInput: SavePersonalLensInput): Promise<void> => {
    const now = new Date()
      .toISOString();

    const existingLens = input.workspace.lenses?.find((lens) => {
      return lens.id === lensInput.id;
    });

    if (existingLens) {
      await input.save(savePersonalLens({
        lens: {
          ...existingLens,
          name: lensInput.name,
          updatedAt: now,
          view: lensInput.view,
        },
        workspace: input.workspace,
      }));

      return;
    }

    await input.save(createPersonalLens({
      id: input.generateId(),
      name: lensInput.name,
      now,
      recordTypes: ["capture", "checklist", "note", "reference"],
      view: lensInput.view,
      workspace: input.workspace,
    }));
  };
}
