import type { ContentReference } from "./content-reference.type";

export interface PersonalNote {
  id: string;
  sourceCaptureId?: string;
  contentReference?: ContentReference;
  title: string;
  body: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}
