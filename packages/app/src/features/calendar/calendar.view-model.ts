import { format } from "date-fns";
import { useState } from "react";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { useCalendarEntriesQuery } from "./use-calendar-entries-query.hook";
import { useCreateCalendarEntryMutation } from "./use-create-calendar-entry-mutation.hook";
import type { CalendarViewModel } from "./calendar-view-model.interface";
import type { CalendarView } from "@guesant/saberes-application";

export function useCalendarViewModel(): CalendarViewModel {
  const services = useAppServices();

  const [view, setView] = useState<CalendarView>("list");

  const [anchorDate, setAnchorDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const query = useCalendarEntriesQuery(services, view, anchorDate);

  const mutation = useCreateCalendarEntryMutation(services);

  return {
    anchorDate,
    createEntry: async (input): Promise<void> => {
      await mutation.mutateAsync(input);
    },
    entries: query.data ?? [],
    error: query.error ?? null,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
    setAnchorDate,
    setView,
    state: getQueryViewState(query),
    view,
  };
}
