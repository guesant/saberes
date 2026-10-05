import type { ReminderPreference } from "../models/reminder-preference.type";

export function isReminderEnabled(preference: ReminderPreference): boolean {
  return preference === "yes";
}
