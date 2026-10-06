import { FocusSessionStatus, type FocusSession } from "@guesant/saberes-application";
import { parseContentReference } from "@guesant/saberes-application";

export function createFocusSession(
  id: string,
  startedAt: string,
  contentKey?: string,
): FocusSession {
  return {
    contentReference: parseContentReference(contentKey),
    id,
    status: FocusSessionStatus.Active,
    startedAt,
    elapsedMs: 0,
  };
}
