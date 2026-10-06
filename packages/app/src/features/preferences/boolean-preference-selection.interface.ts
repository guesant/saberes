import type { PreferenceKey } from "./preference-key.type";

export interface BooleanPreferenceSelection {
  key: Exclude<PreferenceKey, "reminders">;
  value: boolean;
}
