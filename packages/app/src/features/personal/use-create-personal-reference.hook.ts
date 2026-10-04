import { addPersonalReference } from "./add-personal-reference.function";
import type { PersonalIdGenerator } from "./personal-id-generator.type";
import type { PersonalWorkspaceSaver } from "./personal-workspace-saver.type";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export function useCreatePersonalReference(
  workspace: PersonalWorkspace,
  save: PersonalWorkspaceSaver,
  generateId: PersonalIdGenerator,
) {
  return async (title: string, source: string, contentKey?: string): Promise<void> => {
    await save(
      addPersonalReference({
        workspace,
        id: generateId(),
        title,
        source,
        contentKey,
        now: new Date()
          .toISOString(),
      }),
    );
  };
}
