import { useQuery } from "@tanstack/react-query";
import type { PreferencesQueryData } from "./preferences-query-data.interface";
import type { ApplicationServices } from "@guesant/saberes-application";

export function usePreferencesQuery(services: ApplicationServices) {
  return useQuery<PreferencesQueryData, Error>({
    queryKey: ["settings", "experience"],
    queryFn: async (): Promise<PreferencesQueryData> => {
      const settings = await Promise.all([
        services.progress.getSetting.execute("recommendations"),
        services.progress.getSetting.execute("gamification"),
        services.progress.getSetting.execute("richContent"),
        services.progress.getSetting.execute("reminders"),
      ]);

      return {
        recommendations: settings[0]?.value !== false,
        gamification: settings[1]?.value !== false,
        richContent: settings[2]?.value !== false,
        reminders: settings[3]?.value === true,
      };
    },
  });
}
