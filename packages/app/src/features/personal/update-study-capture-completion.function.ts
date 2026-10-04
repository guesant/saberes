import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface UpdateStudyCaptureCompletionInput {
  workspace: PersonalWorkspace;
  id: string;
  now: string;
}

export function updateStudyCaptureCompletion(
  input: UpdateStudyCaptureCompletionInput,
): PersonalWorkspace {
  return {
    ...input.workspace,
    captures: input.workspace.captures.map((capture) => {
      return capture.id === input.id
        ? { ...capture, completed: !capture.completed, updatedAt: input.now }
        : capture;
    }),
  };
}
