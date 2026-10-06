import { UIButton, UIContentGroup } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PreferenceOptionList } from "./preference-option-list.component";
import { PreferencesHeader } from "./preferences-header.component";
import type { PreferencesViewModel } from "./preferences.view-model";

export interface PreferencesReadyViewProps {
  viewModel: PreferencesViewModel;
}

export function PreferencesReadyView(props: PreferencesReadyViewProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="section">
      <PreferencesHeader />
      <PreferenceOptionList
        gamification={props.viewModel.gamification}
        onChange={props.viewModel.setPreference}
        recommendations={props.viewModel.recommendations}
        reminders={props.viewModel.reminders}
        richContent={props.viewModel.richContent}
        saveState={props.viewModel.saveState}
      />
      <UIButton onClick={props.viewModel.restoreDefaults} variant="outlined">
        {t("preferences.restoreDefaults")}
      </UIButton>
    </UIContentGroup>
  );
}
