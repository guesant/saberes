import { FocusSessionStatus, type FocusSession } from "@guesant/saberes-application";

export function pauseFocusSession(session: FocusSession, pausedAt: Date): FocusSession {
  return {
    ...session,
    elapsedMs: pausedAt.getTime() - new Date(session.startedAt)
      .getTime(),
    pausedAt: pausedAt.toISOString(),
    status: FocusSessionStatus.Paused,
  };
}
