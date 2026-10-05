import { UIContentGroup, UITextField } from "@guesant/saberes-ui";
import { CalendarEntryDateFields } from "./calendar-entry-date-fields.component";
import type { CalendarEntryFormFieldsProps } from "./calendar-entry-form-fields-props.interface";

export function CalendarEntryFormFields(props: CalendarEntryFormFieldsProps) {
  return (
    <UIContentGroup variant="content">
      <UITextField
        label="Título"
        onChange={(event) => {
          return props.onTitleChange(event.target.value);
        }}
        value={props.title}
      />
      <UITextField
        label="Descrição"
        multiline
        onChange={(event) => {
          return props.onDescriptionChange(event.target.value);
        }}
        value={props.description}
      />
      <CalendarEntryDateFields
        endsAt={props.endsAt}
        onEndsAtChange={props.onEndsAtChange}
        onStartsAtChange={props.onStartsAtChange}
        startsAt={props.startsAt}
      />
    </UIContentGroup>
  );
}
