import { listCalendarEntries } from "@guesant/saberes-domain";
import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ListCalendarEntriesQueryInput , ListCalendarEntriesPort } from "@guesant/saberes-application";
import type { CalendarEntry } from "@guesant/saberes-domain";

export class ListCalendarEntriesAdapter implements ListCalendarEntriesPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(input: ListCalendarEntriesQueryInput): Promise<CalendarEntry[]> {
    const workspace = await this.store.getPersonalWorkspace();

    return listCalendarEntries({ ...input, workspace });
  }
}
