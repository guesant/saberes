import { UITypography } from "@guesant/saberes-ui";

export interface TopicEmptySectionProps {
  label: string;
}

export function TopicEmptySection(props: TopicEmptySectionProps) {
  return <UITypography color="text.secondary">{props.label}</UITypography>;
}
