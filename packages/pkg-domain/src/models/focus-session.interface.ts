import type { FocusSessionStatus } from "./domain.enums";

export interface FocusSession {
  id: string;
  contentKey?: string;
  title?: string;
  status: FocusSessionStatus;
  startedAt: string;
  pausedAt?: string;
  endedAt?: string;
  elapsedMs: number;
}
