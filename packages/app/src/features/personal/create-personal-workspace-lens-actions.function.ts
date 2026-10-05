import { createPersonalLens, type PersonalRelationRecordType } from "@guesant/saberes-application";
import type { PersonalWorkspaceActionsInput } from "./personal-workspace-actions-input.interface";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";
import type { SavePersonalLensInput } from "./save-personal-lens-input.interface";

const personalLensRecordTypes: PersonalRelationRecordType[] = [
  "capture",
  "checklist",
  "note",
  "reference",
];

export function createPersonalWorkspaceLensActions(
  input: PersonalWorkspaceActionsInput,
): Pick<PersonalWorkspaceViewModel, "saveLens"> {
  return {
    saveLens: async (lensInput: SavePersonalLensInput): Promise<void> => {
      const now = new Date()
        .toISOString();

      await input.save(createPersonalLens({
        id: input.generateId(),
        name: lensInput.name,
        now,
        recordTypes: personalLensRecordTypes,
        view: lensInput.view,
        workspace: input.workspace,
      }));
    },
  };
}
