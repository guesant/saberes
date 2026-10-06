import type { PreferenceSaveState } from "./preference-save-state.type";
import type { PreferenceSelection } from "./preference-selection.type";

export interface PreferenceSaveController {
  saveState: PreferenceSaveState;
  updatePreference(input: PreferenceSelection): Promise<void>;
}
