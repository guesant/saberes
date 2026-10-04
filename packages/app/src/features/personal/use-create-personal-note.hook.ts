import { addPersonalNote } from "./add-personal-note.function";
import type { PersonalIdGenerator } from "./personal-id-generator.type";
import type { PersonalWorkspaceSaver } from "./personal-workspace-saver.type";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export function useCreatePersonalNote(
  workspace: PersonalWorkspace,
  save: PersonalWorkspaceSaver,
  generateId: PersonalIdGenerator,
) {
  return async (title: string, body: string, contentKey?: string): Promise<void> => {
    await save(
      addPersonalNote({
        workspace,
        id: generateId(),
        title,
        body,
        contentKey,
        now: new Date().toISOString(),
      }),
    );
  };
}
