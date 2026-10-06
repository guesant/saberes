import type { ContentReference } from "./content-reference.type";

export interface PersonalReference {
  id: string;
  contentReference?: ContentReference;
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
