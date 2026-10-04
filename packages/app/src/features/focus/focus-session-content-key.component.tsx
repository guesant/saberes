import { UITypography } from "@guesant/saberes-ui";

export interface FocusSessionContentKeyProps {
  contentKey: string;
}

export function FocusSessionContentKey(props: FocusSessionContentKeyProps) {
  return <UITypography color="text.secondary">{props.contentKey}</UITypography>;
}
