import { isReminderEnabled } from "@guesant/saberes-application";
import type { MyStudyFeatureVisibility } from "./my-study-feature-visibility.interface";
import type { PreferencesQueryData } from "../preferences/preferences-query-data.interface";

export function getMyStudyFeatureVisibility(
  preferences: PreferencesQueryData,
): MyStudyFeatureVisibility {
  return {
    showGamification: preferences.gamification,
    showRecommendations: preferences.recommendations,
    showReminders: isReminderEnabled(preferences.reminders),
    showRichContent: preferences.richContent,
  };
}
