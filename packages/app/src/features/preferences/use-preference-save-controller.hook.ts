import { useState } from "react";
import { useSavePreferenceMutation } from "./use-save-preference-mutation.hook";
import type { PreferenceSaveController } from "./preference-save-controller.interface";
import type { PreferenceSaveState } from "./preference-save-state.type";
import type { PreferenceSelection } from "./preference-selection.type";

export function usePreferenceSaveController(
  mutation: ReturnType<typeof useSavePreferenceMutation>,
): PreferenceSaveController {
  const [saveState, setSaveState] = useState<PreferenceSaveState>({
    gamification: "idle",
    recommendations: "idle",
    reminders: "idle",
    richContent: "idle",
  });

  const updatePreference = async (input: PreferenceSelection): Promise<void> => {
    setSaveState((current) => { return { ...current, [input.key]: "saving" }; });

    try {
      await mutation.mutateAsync(input);

      setSaveState((current) => { return { ...current, [input.key]: "idle" }; });
    } catch {
      setSaveState((current) => { return { ...current, [input.key]: "error" }; });
    }
  };

  return { saveState, updatePreference };
}
