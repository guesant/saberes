import { UIContentGroup } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { createPreferenceOptionData } from "./create-preference-option-data.function";
import { PreferenceOption } from "./preference-option.component";
import type { PreferenceSaveState } from "./preference-save-state.type";
import type { PreferenceSelection } from "./preference-selection.type";
import type { ReminderPreference } from "@guesant/saberes-application";

export interface PreferenceOptionListProps {
  recommendations: boolean;
  gamification: boolean;
  richContent: boolean;
  reminders: ReminderPreference;
  saveState: PreferenceSaveState;
  onChange(input: PreferenceSelection): Promise<void>;
}

export function PreferenceOptionList(props: PreferenceOptionListProps) {
  const { t } = useTranslation();

  const options = createPreferenceOptionData({
    gamification: props.gamification,
    recommendations: props.recommendations,
    richContent: props.richContent,
    reminders: props.reminders,
    translate: t,
  });

  return (
    <UIContentGroup variant="list">
      {options.map((option) => {
        return (
          <PreferenceOption
            key={option.key}
            onChange={props.onChange}
            option={option}
            saveState={props.saveState[option.key]}
          />
        );
      })}
    </UIContentGroup>
  );
}
