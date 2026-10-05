import { UIChip } from "@guesant/saberes-ui";
import type { PersonalCaptureFilterChipProps } from "./personal-capture-filter-chip-props.interface";

export function PersonalCaptureFilterChip(props: PersonalCaptureFilterChipProps) {
  return (
    <UIChip
      color={props.selected ? "primary" : "default"}
      label={props.label}
      onClick={() => {
        return props.onChange(props.filter);
      }}
      variant={props.selected ? "filled" : "outlined"}
    />
  );
}
