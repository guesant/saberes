import { isAfter, isBefore, parseISO } from "date-fns";
import type { ReviewLoadSummary } from "./review-load-summary.interface";
import type { ReviewTarget } from "@guesant/saberes-application";

export function getReviewLoadSummary(targets: ReviewTarget[], now: Date): ReviewLoadSummary {
  const activeTargets = targets.filter((target) => !target.suspended);

  const due = activeTargets.filter((target) => {
    if (!target.dueAt) {
      return true;
    }

    const dueAt = parseISO(target.dueAt);

    return isBefore(dueAt, now);
  }).length;

  const upcoming = activeTargets.filter((target) => {
    if (!target.dueAt) {
      return false;
    }

    return isAfter(parseISO(target.dueAt), now);
  }).length;

  return {
    due,
    upcoming,
    suspended: targets.length - activeTargets.length,
    total: targets.length,
  };
}
