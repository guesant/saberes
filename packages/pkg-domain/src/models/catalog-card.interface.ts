import type { CatalogCardType } from "./domain.enums";

export interface CatalogCard {
  id: number | string;
  title: string;
  description?: string;
  type: CatalogCardType;
  slug?: string;
  href?: string;
  meta?: string;
  courseType?: string;
  topicCount?: number;
  stepCount?: number;
  moduleCount?: number;
  totalMinutes?: number;
  processName?: string;
  year?: number;
  editorialStatus?: "draft" | "review" | "published";
  editorialNote?: string;
  availabilityMode?: "learning" | "practice" | "consultation_only" | "reference";
  resourceKind?: string;
  reuseStatus?: "unknown" | "link_only" | "open_license" | "public_domain" | "permission_confirmed";
  licenseName?: string;
  licenseUrl?: string;
}
