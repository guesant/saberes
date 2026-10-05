import type { ArchiveStudyCaptureInput } from "./archive-study-capture-input.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export function archiveStudyCapture(input: ArchiveStudyCaptureInput): PersonalWorkspace {
  return {
    ...input.workspace,
    captures: input.workspace.captures.map((capture) => {
      return capture.id === input.id
        ? { ...capture, archived: true, updatedAt: input.now }
        : capture;
    }),
  };
}
