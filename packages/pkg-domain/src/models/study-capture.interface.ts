import type { ContentReference } from "./content-reference.type";

export interface StudyCapture {
  id: string;
  contentReference?: ContentReference;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  completed: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}
