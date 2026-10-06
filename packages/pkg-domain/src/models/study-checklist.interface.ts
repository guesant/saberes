import type { ContentReference } from "./content-reference.type";
import type { StudyChecklistItem } from "./study-checklist-item.interface";

export interface StudyChecklist {
  id: string;
  contentReference?: ContentReference;
  title: string;
  items: StudyChecklistItem[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}
