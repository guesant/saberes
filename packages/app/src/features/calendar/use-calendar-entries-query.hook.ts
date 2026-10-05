import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices, CalendarEntry, CalendarView } from "@guesant/saberes-application";

export function useCalendarEntriesQuery(
  services: ApplicationServices,
  view: CalendarView,
  anchorDate: string,
) {
  return useQuery<CalendarEntry[], Error>({
    queryKey: ["planning", "calendar", view, anchorDate],
    queryFn: () => {
      return services.planning.listCalendarEntries.execute({ anchorDate, view });
    },
  });
}
