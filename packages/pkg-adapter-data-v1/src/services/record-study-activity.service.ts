import { format, isSameDay, parseISO, subDays } from "date-fns";
import { progressDb } from "../storage/progress.database";

export type StudyActivity = {
  at?: Date | string;
  type?: string;
};

export async function recordStudyActivity(activity: StudyActivity = {}) {
  const today = format(activity.at || new Date(), "yyyy-MM-dd");

  const previous = await progressDb.getStreak();

  const previousDate = previous?.lastDate ? parseISO(previous.lastDate as string) : null;

  const continues = previousDate ? isSameDay(subDays(parseISO(today), 1), previousDate) : false;

  let current = 1;

  if (previous?.lastDate === today) {
    current = Number(previous.current || 0);
  } else if (continues) {
    current = Number(previous?.current || 0) + 1;
  }

  const next = {
    current,
    best: Math.max(Number(previous?.best || 0), current),
    lastDate: today,
    lastActivity: activity.type || "study",
  };

  await progressDb.saveStreak(next);

  return next;
}
