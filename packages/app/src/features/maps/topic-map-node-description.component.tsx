import { UITypography } from "@guesant/saberes-ui";

export interface TopicMapNodeDescriptionProps {
  description: string;
}

export function TopicMapNodeDescription(props: TopicMapNodeDescriptionProps) {
  if (!props.description) {
    return null;
  }

  return <UITypography variant="body2">{props.description}</UITypography>;
}
