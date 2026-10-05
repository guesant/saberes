import { UIButton, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { CalendarEntryFormFields } from "./calendar-entry-form-fields.component";
import { useCalendarEntryFormState } from "./use-calendar-entry-form-state.hook";
import type { CalendarEntryFormProps } from "./calendar-entry-form-props.interface";

export function CalendarEntryForm(props: CalendarEntryFormProps) {
  const state = useCalendarEntryFormState(props);

  return (
    <UIContentGroup variant="content">
      <UITypography variant="h5">{props.title}</UITypography>
      <CalendarEntryFormFields
        description={state.description}
        endsAt={state.endsAt}
        onDescriptionChange={state.setDescription}
        onEndsAtChange={state.setEndsAt}
        onStartsAtChange={state.setStartsAt}
        onTitleChange={state.setTitle}
        startsAt={state.startsAt}
        title={state.title}
      />
      <UIButton disabled={!state.title.trim() || !state.startsAt} onClick={state.create} variant="outlined">
        {props.submitLabel}
      </UIButton>
    </UIContentGroup>
  );
}
