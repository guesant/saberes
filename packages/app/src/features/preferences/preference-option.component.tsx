import { UIContentGroup, UIPreferenceRow, UITypography } from "@guesant/saberes-ui";
import { PreferenceControl } from "./preference-control.component";
import { PreferenceSaveStatus } from "./preference-save-status.component";
import type { PreferenceOptionData } from "./preference-option-data.interface";
import type { PreferenceSaveState } from "./preference-save-state.type";
import type { PreferenceSelection } from "./preference-selection.type";

export interface PreferenceOptionProps {
  option: PreferenceOptionData;
  saveState: PreferenceSaveState[PreferenceOptionData["key"]];
  onChange(input: PreferenceSelection): Promise<void>;
}

export function PreferenceOption(props: PreferenceOptionProps) {
  return (
    <UIPreferenceRow control={<PreferenceControl onChange={props.onChange} option={props.option} />}>
      <UIContentGroup variant="content">
        <UITypography variant="h6">{props.option.title}</UITypography>
        <UITypography color="text.secondary">{props.option.description}</UITypography>
        <PreferenceSaveStatus state={props.saveState} />
      </UIContentGroup>
    </UIPreferenceRow>
  );
}
