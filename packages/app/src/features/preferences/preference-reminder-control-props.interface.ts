import type { PreferenceSelection } from "./preference-selection.type";
import type { ReminderPreference } from "@guesant/saberes-application";

export interface PreferenceReminderControlProps {
  value: boolean | ReminderPreference;
  onChange(input: PreferenceSelection): Promise<void>;
}
