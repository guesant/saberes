import type { PostponeStudyCaptureInput } from "./postpone-study-capture-input.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export function postponeStudyCapture(input: PostponeStudyCaptureInput): PersonalWorkspace {
  return {
    ...input.workspace,
    captures: input.workspace.captures.map((capture) => {
      return capture.id === input.id
        ? { ...capture, completed: false, dueDate: input.dueDate, updatedAt: input.now }
        : capture;
    }),
  };
}
