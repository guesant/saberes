import type { UpdateStudyCaptureContentInput } from "./update-study-capture-content-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export function updateStudyCaptureContent(
  input: UpdateStudyCaptureContentInput,
): PersonalWorkspace {
  return {
    ...input.workspace,
    captures: input.workspace.captures.map((capture) =>
      capture.id === input.id
        ? {
            ...capture,
            title: input.title,
            description: input.description,
            dueDate: input.dueDate || undefined,
            updatedAt: new Date().toISOString(),
          }
        : capture,
    ),
  };
}
