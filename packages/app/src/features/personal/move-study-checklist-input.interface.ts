import type { StudyChecklist } from "@guesant/saberes-application";

export interface MoveStudyChecklistInput {
  checklist: StudyChecklist;

  direction: "down" | "up";

  itemId: string;

  now: string;
}
