import type { StudyChecklist } from "@guesant/saberes-application";

export interface StudyChecklistEntriesProps {
  checklist: StudyChecklist;
  onMoveItem(checklistId: string, itemId: string, direction: "down" | "up"): Promise<void>;

  onUpdateItem(checklistId: string, itemId: string): Promise<void>;
}
