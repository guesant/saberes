import { parseContentReference } from "@guesant/saberes-application";
import type { PersonalWorkspace, StudyCapture } from "@guesant/saberes-application";

export interface AddStudyCaptureInput {
  workspace: PersonalWorkspace;
  id: string;
  title: string;
  description: string;
  contentKey?: string;
  dueDate?: string;
  now: string;
}

export function addStudyCapture(input: AddStudyCaptureInput): PersonalWorkspace {
  const capture: StudyCapture = {
    id: input.id,
    title: input.title,
    description: input.description,
    contentReference: parseContentReference(input.contentKey),
    dueDate: input.dueDate,
    priority: "medium",
    completed: false,
    archived: false,
    createdAt: input.now,
    updatedAt: input.now,
  };

  return { ...input.workspace, captures: [...input.workspace.captures, capture] };
}
