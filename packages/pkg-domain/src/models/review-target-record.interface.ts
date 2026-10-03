import type { ContentKey } from "./content-key.type";
import type { ReviewState, ReviewTargetType } from "./domain.enums";

export interface ReviewTargetRecord {
  contentKey: ContentKey | string;
  targetType?: ReviewTargetType;
  dueAt?: string;
  state?: ReviewState;
  suspended?: boolean;
  [key: string]: unknown;
}
