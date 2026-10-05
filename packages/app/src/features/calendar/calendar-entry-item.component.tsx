import { UIListItem, UIListItemText } from "@guesant/saberes-ui";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CalendarEntryItemProps } from "./calendar-entry-item-props.interface";

export function CalendarEntryItem(props: CalendarEntryItemProps) {
  const startsAt = format(new Date(props.entry.startsAt), "PPP", { locale: ptBR });

  return (
    <UIListItem>
      <UIListItemText primary={props.entry.title} secondary={`${startsAt} · ${props.entry.description}`} />
    </UIListItem>
  );
}
