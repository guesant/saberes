import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface UpdateStudyCaptureContentInput {
  workspace: PersonalWorkspace;
  id: string;
  title: string;
  description: string;
  dueDate?: string;
}
