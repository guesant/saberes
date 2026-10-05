import type { ReminderPreference } from "@guesant/saberes-application";

export interface CreatePreferenceOptionDataInput {
  recommendations: boolean;
  gamification: boolean;
  richContent: boolean;
  reminders: ReminderPreference;
  translate(key: string): string;
}
