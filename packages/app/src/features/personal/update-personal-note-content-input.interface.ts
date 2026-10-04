import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface UpdatePersonalNoteContentInput {
  workspace: PersonalWorkspace;
  id: string;
  title: string;
  body: string;
  contentKey?: string;
}
