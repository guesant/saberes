import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface UpdatePersonalReferenceContentInput {
  workspace: PersonalWorkspace;
  id: string;
  title: string;
  source: string;
}
