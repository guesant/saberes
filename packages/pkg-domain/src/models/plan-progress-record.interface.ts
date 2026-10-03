import type { ContentKey } from "./content.models.ts";

export interface PlanProgressRecord {
  contentKey: ContentKey | string;
  planId?: number | string;
  stepId?: number | string;
  completed?: boolean;
  [key: string]: unknown;
}
