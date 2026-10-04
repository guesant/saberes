import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SavePreferenceInput } from "./save-preference-input.interface";
import type { ApplicationServices } from "@guesant/saberes-application";

export function useSavePreferenceMutation(services: ApplicationServices) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SavePreferenceInput) => {
      return services.progress.saveSetting.execute(input);
    },
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: ["settings", "experience"] });
    },
  });
}
