import { FocusSessionStatus, type FocusSession } from "@guesant/saberes-application";

export function findFocusSessionByStatus(
  sessions: FocusSession[],
  status: FocusSessionStatus,
): FocusSession | null {
  return sessions.find((session) => {
    return session.status === status;
  }) || null;
}
