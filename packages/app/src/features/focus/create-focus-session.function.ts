import { FocusSessionStatus, type FocusSession } from "@guesant/saberes-application";

export function createFocusSession(
  id: string,
  startedAt: string,
  contentKey?: string,
): FocusSession {
  return {
    contentKey,
    id,
    status: FocusSessionStatus.Active,
    startedAt,
    elapsedMs: 0,
  };
}
