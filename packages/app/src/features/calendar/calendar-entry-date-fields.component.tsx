import { UIContentGroup, UITextField } from "@guesant/saberes-ui";
import type { CalendarEntryDateFieldsProps } from "./calendar-entry-date-fields-props.interface";

export function CalendarEntryDateFields(props: CalendarEntryDateFieldsProps) {
  return (
    <UIContentGroup variant="inline">
      <UITextField
        label="Início"
        onChange={(event) => {
          return props.onStartsAtChange(event.target.value);
        }}
        type="date"
        value={props.startsAt}
      />
      <UITextField
        label="Fim (opcional)"
        onChange={(event) => {
          return props.onEndsAtChange(event.target.value);
        }}
        type="date"
        value={props.endsAt}
      />
    </UIContentGroup>
  );
}
