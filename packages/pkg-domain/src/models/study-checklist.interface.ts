import type { ContentKey } from "./content-key.type";
import type { StudyChecklistItem } from "./study-checklist-item.interface";

export interface StudyChecklist {
  id: string;
  contentKey?: ContentKey | string;
  title: string;
  items: StudyChecklistItem[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}
