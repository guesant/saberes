import type { ContentKey } from "./content-key.type";

export interface PersonalReference {
  id: string;
  contentKey?: ContentKey | string;
  title: string;
  type: "book" | "video" | "article" | "link" | "local";
  source: string;
  location: string;
  rights: string;
  available: boolean;
  favorite: boolean;
  archived: boolean;
  tags: string[];
  privateNote: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}
