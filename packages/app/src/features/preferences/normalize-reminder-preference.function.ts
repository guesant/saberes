import type { ReminderPreference } from "@guesant/saberes-application";

export function normalizeReminderPreference(value: boolean | string | undefined): ReminderPreference {
  if (value === "yes" || value === "never" || value === "not-now") {
    return value;
  }

  return value === true ? "yes" : "not-now";
}
