import { UIContentGroup } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { createPreferenceOptionData } from "./create-preference-option-data.function";
import { PreferenceOption } from "./preference-option.component";
import type { PreferenceKey } from "./preference-key.type";

export interface PreferenceOptionListProps {
  recommendations: boolean;
  gamification: boolean;
  richContent: boolean;
  reminders: boolean;
  onToggle(key: PreferenceKey): Promise<void>;
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
            description={option.description}
            key={option.key}
            onToggle={props.onToggle}
            preferenceKey={option.key}
            title={option.title}
            value={option.value}
          />
        );
      })}
    </UIContentGroup>
  );
}
