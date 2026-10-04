import { isBefore, isSameDay, parseISO } from "date-fns";
import type { ReviewTarget } from "@guesant/saberes-application";

export function getDueReviewTargets(targets: ReviewTarget[], now: Date): ReviewTarget[] {
  return targets.filter((target) => {
    if (target.suspended) {
      return false;
    }

    if (!target.dueAt) {
      return true;
    }

    const dueAt = parseISO(target.dueAt);

    return isSameDay(dueAt, now) || isBefore(dueAt, now);
  });
}
