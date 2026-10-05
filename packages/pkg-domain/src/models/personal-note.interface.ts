import type { ContentKey } from "./content-key.type";

export interface PersonalNote {
  id: string;
  sourceCaptureId?: string;
  contentKey?: ContentKey | string;
  title: string;
  body: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}
