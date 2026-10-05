import type { PreferenceKey } from "./preference-key.type";
import type { ReminderPreference } from "@guesant/saberes-application";

export interface PreferenceOptionData {
  description: string;
  key: PreferenceKey;
  title: string;
  value: boolean | ReminderPreference;
}
