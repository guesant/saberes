import { normalizeReminderPreference } from "./normalize-reminder-preference.function";
import type { SettingRecord } from "@guesant/saberes-application";

export function normalizeReminderSetting(setting: SettingRecord | undefined) {
  if (setting?.value === true) {
    return normalizeReminderPreference(true);
  }

  if (typeof setting?.value === "string") {
    return normalizeReminderPreference(setting.value);
  }

  return normalizeReminderPreference(undefined);
}
