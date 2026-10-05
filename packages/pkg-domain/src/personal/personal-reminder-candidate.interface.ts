import type { PersonalReminderSource } from "./personal-reminder-source.type";

export interface PersonalReminderCandidate {
  id: string;
  source: PersonalReminderSource;
  title: string;
  dueAt: string;
}
