import type { ListCalendarEntriesQueryInput } from "../models/list-calendar-entries-query-input.interface";
import type { ListCalendarEntriesPort } from "../ports/list-calendar-entries-port.port";
import type { CalendarEntry } from "@guesant/saberes-domain";

export class ListCalendarEntriesQueryHandler {
  public constructor(private readonly port: ListCalendarEntriesPort) {}

  public execute(input: ListCalendarEntriesQueryInput): Promise<CalendarEntry[]> {
    return this.port.execute(input);
  }
}
