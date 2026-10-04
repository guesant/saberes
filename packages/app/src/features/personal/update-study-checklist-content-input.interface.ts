import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface UpdateStudyChecklistContentInput {
  workspace: PersonalWorkspace;
  id: string;
  itemIds: string[];
  items: string[];
  title: string;
  contentKey?: string;
  now: string;
}
