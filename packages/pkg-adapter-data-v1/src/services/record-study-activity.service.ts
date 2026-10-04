import { format, isSameDay, parseISO, subDays } from "date-fns";
import type { ProgressStorageContract } from "../storage/progress-storage.contract";

export type StudyActivity = {
  at?: Date | string;
  type?: string;
};

export async function recordStudyActivity(
  storage: ProgressStorageContract,
  activity: StudyActivity = {},
) {
  const today = format(activity.at || new Date(), "yyyy-MM-dd");

  const previous = await storage.getStreak();

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

  await storage.saveStreak(next);

  return next;
}
