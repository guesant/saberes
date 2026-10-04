import { FocusSessionStatus, type FocusSession } from "@guesant/saberes-application";

export function resumeFocusSession(session: FocusSession, resumedAt: Date): FocusSession {
  return {
    ...session,
    pausedAt: undefined,
    startedAt: new Date(resumedAt.getTime() - session.elapsedMs).toISOString(),
    status: FocusSessionStatus.Active,
  };
}
