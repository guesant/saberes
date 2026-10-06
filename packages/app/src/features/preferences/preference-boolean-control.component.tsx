import { UISwitch } from "@guesant/saberes-ui";
import type { PreferenceBooleanControlProps } from "./preference-boolean-control-props.interface";

export function PreferenceBooleanControl(props: PreferenceBooleanControlProps) {
  return (
    <UISwitch
      checked={props.checked}
      slotProps={{ input: { "aria-label": props.title } }}
      onChange={(_, checked) => {
        return props.onChange({ key: props.preferenceKey, value: checked });
      }}
    />
  );
}
