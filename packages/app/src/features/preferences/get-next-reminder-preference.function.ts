import type { ReminderPreference } from "@guesant/saberes-application";

export function getNextReminderPreference(preference: ReminderPreference): ReminderPreference {
  if (preference === "yes") {
    return "not-now";
  }

  if (preference === "not-now") {
    return "never";
  }

  return "yes";
}
