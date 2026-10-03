import type { ContentKey } from "./content.models.ts";
import type { ReviewState, ReviewTargetType } from "./domain.enums.ts";

export interface ReviewTargetRecord {
  contentKey: ContentKey | string;
  targetType?: ReviewTargetType;
  dueAt?: string;
  state?: ReviewState;
  suspended?: boolean;
  [key: string]: unknown;
}
