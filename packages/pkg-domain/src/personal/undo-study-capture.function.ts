import type { UndoStudyCaptureInput } from "./undo-study-capture-input.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export function undoStudyCapture(input: UndoStudyCaptureInput): PersonalWorkspace {
  return {
    ...input.workspace,
    captures: input.workspace.captures.map((capture) => {
      return capture.id === input.id
        ? {
          ...capture,
          archived: input.archived,
          completed: input.completed,
          dueDate: input.dueDate,
          updatedAt: input.now,
        }
        : capture;
    }),
  };
}
