import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { getDefaultPreferences } from "./get-default-preferences.function";
import { usePreferencesQuery } from "./use-preferences-query.hook";
import { useSavePreferenceMutation } from "./use-save-preference-mutation.hook";
import type { PreferenceKey } from "./preference-key.type";

const preferenceKeys: PreferenceKey[] = [
  "gamification",
  "recommendations",
  "reminders",
  "richContent",
];

export interface PreferencesViewModel {
  state: "loading" | "error" | "ready";
  recommendations: boolean;
  gamification: boolean;
  richContent: boolean;
  reminders: boolean;
  error: Error | null;
  togglePreference(key: PreferenceKey): Promise<void>;

  restoreDefaults(): Promise<void>;

  reload(): Promise<void>;
}

export function usePreferencesViewModel(): PreferencesViewModel {
  const services = useAppServices();

  const query = usePreferencesQuery(services);

  const mutation = useSavePreferenceMutation(services);

  const preferenceValues = query.data || getDefaultPreferences();

  const updatePreference = async (key: PreferenceKey): Promise<void> => {
    await mutation.mutateAsync({ key, value: !preferenceValues[key] });
  };

  const restoreDefaults = async (): Promise<void> => {
    const defaults = getDefaultPreferences();

    await Promise.all(
      preferenceKeys.map((key) => {
        return mutation.mutateAsync({ key, value: defaults[key] });
      }),
    );
  };

  const state = getQueryViewState(query);

  return {
    state,
    ...preferenceValues,
    error: query.error ?? null,
    togglePreference: updatePreference,
    restoreDefaults,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
  };
}
