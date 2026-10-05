import { UIButton, UIInlineActions, UIListItem, UIListItemText } from "@guesant/saberes-ui";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { CalendarEntryEditDialog } from "./calendar-entry-edit-dialog.component";
import type { CalendarEntryItemProps } from "./calendar-entry-item-props.interface";

export function CalendarEntryItem(props: CalendarEntryItemProps) {
  const { t } = useTranslation();

  const startsAt = format(new Date(props.entry.startsAt), "PPP", { locale: ptBR });

  return (
    <UIListItem>
      <UIListItemText primary={props.entry.title} secondary={`${startsAt} · ${props.entry.description}`} />
      <UIInlineActions wrap>
        <CalendarEntryEditDialog
          entry={props.entry}
          onSave={props.onSave}
          title={t("calendar.edit")}
          triggerLabel={t("calendar.edit")}
        />
        <UIButton onClick={() => { return props.onDelete(props.entry.id); }} variant="text">
          {t("calendar.delete")}
        </UIButton>
      </UIInlineActions>
    </UIListItem>
  );
}
