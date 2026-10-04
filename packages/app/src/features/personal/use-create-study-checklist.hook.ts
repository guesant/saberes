import { addStudyChecklist } from "./add-study-checklist.function";
import type { PersonalIdGenerator } from "./personal-id-generator.type";
import type { PersonalWorkspaceSaver } from "./personal-workspace-saver.type";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export function useCreateStudyChecklist(
  workspace: PersonalWorkspace,
  save: PersonalWorkspaceSaver,
  generateId: PersonalIdGenerator,
) {
  return async (title: string, items: string[], contentKey?: string): Promise<void> => {
    await save(
      addStudyChecklist({
        workspace,
        id: generateId(),
        itemIds: items.map(() => {
          return generateId();
        }),
        title,
        items,
        contentKey,
        now: new Date()
          .toISOString(),
      }),
    );
  };
}
