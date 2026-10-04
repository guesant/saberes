import { differenceInCalendarDays, parseISO } from "date-fns";
import { getPerformanceAccuracy } from "./get-performance-accuracy.function";
import type { Attempt } from "@guesant/saberes-application";

export function getPerformanceTrend(attempts: Attempt[], now: Date): "down" | "stable" | "up" {
  const current = attempts.filter((attempt) => {
    if (!attempt.answeredAt) {
      return false;
    }

    return differenceInCalendarDays(now, parseISO(attempt.answeredAt)) < 4;
  });

  const previous = attempts.filter((attempt) => {
    if (!attempt.answeredAt) {
      return false;
    }

    const age = differenceInCalendarDays(now, parseISO(attempt.answeredAt));

    return age >= 4 && age < 8;
  });

  const currentAccuracy = getPerformanceAccuracy(current);

  const previousAccuracy = getPerformanceAccuracy(previous);

  if (currentAccuracy > previousAccuracy + 10) {
    return "up";
  }

  if (currentAccuracy < previousAccuracy - 10) {
    return "down";
  }

  return "stable";
}
