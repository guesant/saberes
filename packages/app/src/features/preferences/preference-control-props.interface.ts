import type { PreferenceOptionData } from "./preference-option-data.interface";
import type { PreferenceSelection } from "./preference-selection.type";

export interface PreferenceControlProps {
  option: PreferenceOptionData;
  onChange(input: PreferenceSelection): Promise<void>;
}
