import { PreferenceBooleanControl } from "./preference-boolean-control.component";
import { PreferenceReminderControl } from "./preference-reminder-control.component";
import type { PreferenceControlProps } from "./preference-control-props.interface";

export function PreferenceControl(props: PreferenceControlProps) {
  if (props.option.key === "reminders") {
    return <PreferenceReminderControl onChange={props.onChange} value={props.option.value} />;
  }

  return (
    <PreferenceBooleanControl
      checked={props.option.value === true}
      onChange={props.onChange}
      preferenceKey={props.option.key}
      title={props.option.title}
    />
  );
}
