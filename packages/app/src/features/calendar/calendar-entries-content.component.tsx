import { UIList } from "@guesant/saberes-ui";
import { CalendarEmptyState } from "./calendar-empty-state.component";
import { CalendarEntryItem } from "./calendar-entry-item.component";
import type { CalendarEntriesContentProps } from "./calendar-entries-content-props.interface";

export function CalendarEntriesContent(props: CalendarEntriesContentProps) {
  if (props.entries.length === 0) {
    return <CalendarEmptyState />;
  }

  return (
    <UIList>
      {props.entries.map((entry) => {
        return <CalendarEntryItem entry={entry} key={entry.id} />;
      })}
    </UIList>
  );
}
