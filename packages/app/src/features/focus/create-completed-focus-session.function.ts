import { FocusSessionStatus, type FocusSession } from "@guesant/saberes-application";

export function createCompletedFocusSession(session: FocusSession, endedAt: Date): FocusSession {
  return {
    ...session,
    status: FocusSessionStatus.Completed,
    endedAt: endedAt.toISOString(),
    elapsedMs: endedAt.getTime() - new Date(session.startedAt)
      .getTime(),
  };
}
