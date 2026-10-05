import type { CompleteStudyCaptureInput } from "./complete-study-capture-input.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export function completeStudyCapture(input: CompleteStudyCaptureInput): PersonalWorkspace {
  return {
    ...input.workspace,
    captures: input.workspace.captures.map((capture) => {
      return capture.id === input.id
        ? { ...capture, completed: true, updatedAt: input.now }
        : capture;
    }),
  };
}
