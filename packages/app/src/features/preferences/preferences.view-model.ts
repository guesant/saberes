import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { getDefaultPreferences } from "./get-default-preferences.function";
import { usePreferenceSaveController } from "./use-preference-save-controller.hook";
import { usePreferencesQuery } from "./use-preferences-query.hook";
import { useSavePreferenceMutation } from "./use-save-preference-mutation.hook";
import type { PreferenceKey } from "./preference-key.type";
import type { PreferenceSaveState } from "./preference-save-state.type";
import type { PreferenceSelection } from "./preference-selection.type";
import type { ReminderPreference } from "@guesant/saberes-application";

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
  reminders: ReminderPreference;
  error: Error | null;
  saveState: PreferenceSaveState;
  setPreference(input: PreferenceSelection): Promise<void>;

  restoreDefaults(): Promise<void>;

  reload(): Promise<void>;
}

export function usePreferencesViewModel(): PreferencesViewModel {
  const services = useAppServices();

  const query = usePreferencesQuery(services);

  const mutation = useSavePreferenceMutation(services);

  const { saveState, updatePreference } = usePreferenceSaveController(mutation);

  const preferenceValues = query.data || getDefaultPreferences();

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
    saveState,
    setPreference: updatePreference,
    restoreDefaults,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
  };
}
