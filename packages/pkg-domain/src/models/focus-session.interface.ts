import type { ContentReference } from "./content-reference.type";
import type { FocusSessionStatus } from "./domain.enums";

export interface FocusSession {
  id: string;
  contentReference?: ContentReference;
  title?: string;
  status: FocusSessionStatus;
  startedAt: string;
  pausedAt?: string;
  endedAt?: string;
  elapsedMs: number;
}
