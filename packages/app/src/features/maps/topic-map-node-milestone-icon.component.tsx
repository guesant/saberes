import { UICheckCircleIcon, UIListItemIcon } from "@guesant/saberes-ui";

export interface TopicMapNodeMilestoneIconProps {
  milestone: boolean;
}

export function TopicMapNodeMilestoneIcon(props: TopicMapNodeMilestoneIconProps) {
  if (!props.milestone) {
    return <UIListItemIcon aria-hidden="true" />;
  }

  return <UIListItemIcon><UICheckCircleIcon color="success" /></UIListItemIcon>;
}
