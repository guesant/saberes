import type { PreferenceKey } from "./preference-key.type";
import type { PreferenceSelection } from "./preference-selection.type";

export interface PreferenceBooleanControlProps {
  checked: boolean;
  preferenceKey: Exclude<PreferenceKey, "reminders">;
  title: string;
  onChange(input: PreferenceSelection): Promise<void>;
}
