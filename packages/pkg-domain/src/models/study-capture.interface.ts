import type { ContentKey } from "./content-key.type";

export interface StudyCapture {
  id: string;
  contentKey?: ContentKey | string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  completed: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}
