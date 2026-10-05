import { UIContentGroup, UISelectableSurface, UITypography } from "@guesant/saberes-ui";
import type { PreferenceKey } from "./preference-key.type";

export interface PreferenceOptionProps {
  preferenceKey: PreferenceKey;
  title: string;
  description: string;
  value: boolean;
  onToggle(key: PreferenceKey): Promise<void>;
}

export function PreferenceOption(props: PreferenceOptionProps) {
  return (
    <UISelectableSurface
      aria-pressed={props.value}
      interactive
      onClick={() => {
        return props.onToggle(props.preferenceKey);
      }}
      selected={props.value}
    >
      <UIContentGroup variant="content">
        <UITypography variant="h6">{props.title}</UITypography>
        <UITypography color="text.secondary">{props.description}</UITypography>
      </UIContentGroup>
    </UISelectableSurface>
  );
}
