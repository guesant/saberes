import type { RestoreStudyCaptureInput } from "./restore-study-capture-input.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export function restoreStudyCapture(input: RestoreStudyCaptureInput): PersonalWorkspace {
  return {
    ...input.workspace,
    captures: input.workspace.captures.map((capture) => {
      return capture.id === input.id
        ? { ...capture, archived: false, updatedAt: input.now }
        : capture;
    }),
  };
}
