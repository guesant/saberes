import type { PreferencesQueryData } from "./preferences-query-data.interface";

export function getDefaultPreferences(): PreferencesQueryData {
  return {
    gamification: true,
    recommendations: true,
    reminders: "not-now",
    richContent: true,
  };
}
