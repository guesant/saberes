import type { ReminderPreference } from "@guesant/saberes-application";

export interface SavePreferenceInput {
  key: string;
  value: boolean | ReminderPreference;
}
