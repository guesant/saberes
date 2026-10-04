import { addStudyCapture } from "./add-study-capture.function";
import type { PersonalIdGenerator } from "./personal-id-generator.type";
import type { PersonalWorkspaceSaver } from "./personal-workspace-saver.type";
import type { StudyCaptureCreateInput } from "./study-capture-create-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export function useCreateStudyCapture(
  workspace: PersonalWorkspace,
  save: PersonalWorkspaceSaver,
  generateId: PersonalIdGenerator,
) {
  return async (input: StudyCaptureCreateInput): Promise<void> => {
    await save(
      addStudyCapture({
        workspace,
        id: generateId(),
        title: input.title,
        description: input.description,
        contentKey: input.contentKey,
        dueDate: input.dueDate || undefined,
        now: new Date()
          .toISOString(),
      }),
    );
  };
}
