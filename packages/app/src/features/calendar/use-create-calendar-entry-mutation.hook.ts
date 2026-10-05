import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CalendarEntryFormInput } from "./calendar-entry-form-input.interface";
import type { ApplicationServices } from "@guesant/saberes-application";

export function useCreateCalendarEntryMutation(services: ApplicationServices) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CalendarEntryFormInput): Promise<void> => {
      await services.planning.createCalendarEntry.execute({
        description: input.description,
        id: services.platform.ids.execute(),
        now: new Date()
          .toISOString(),
        startsAt: new Date(`${input.startsAt}T00:00:00`)
          .toISOString(),
        endsAt: input.endsAt
          ? new Date(`${input.endsAt}T00:00:00`)
            .toISOString()
          : undefined,
        title: input.title,
      });
    },
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: ["planning", "calendar"] });
    },
  });
}
