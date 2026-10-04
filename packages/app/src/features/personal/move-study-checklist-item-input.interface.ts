import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface MoveStudyChecklistItemInput {
  checklistId: string;

  direction: "down" | "up";

  itemId: string;

  now: string;

  workspace: PersonalWorkspace;
}
