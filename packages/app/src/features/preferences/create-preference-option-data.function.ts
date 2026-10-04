import type { CreatePreferenceOptionDataInput } from "./create-preference-option-data-input.interface";
import type { PreferenceOptionData } from "./preference-option-data.interface";

export function createPreferenceOptionData(
  input: CreatePreferenceOptionDataInput,
): PreferenceOptionData[] {
  return [
    {
      description: input.translate("preferences.recommendationsDescription"),
      key: "recommendations",
      title: input.translate("preferences.recommendations"),
      value: input.recommendations,
    },
    {
      description: input.translate("preferences.gamificationDescription"),
      key: "gamification",
      title: input.translate("preferences.gamification"),
      value: input.gamification,
    },
    {
      description: input.translate("preferences.richContentDescription"),
      key: "richContent",
      title: input.translate("preferences.richContent"),
      value: input.richContent,
    },
    {
      description: input.translate("preferences.remindersDescription"),
      key: "reminders",
      title: input.translate("preferences.reminders"),
      value: input.reminders,
    },
  ];
}
