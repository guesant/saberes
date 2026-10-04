import type { StudyChecklistItem } from "@guesant/saberes-application";

export interface SwapStudyChecklistItemsInput {
  currentIndex: number;

  items: StudyChecklistItem[];

  targetIndex: number;
}
