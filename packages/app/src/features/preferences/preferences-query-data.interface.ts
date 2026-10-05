import type { ReminderPreference } from "@guesant/saberes-application";

export interface PreferencesQueryData {
  recommendations: boolean;
  gamification: boolean;
  richContent: boolean;
  reminders: ReminderPreference;
}
