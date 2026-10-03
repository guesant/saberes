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
}
