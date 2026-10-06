import { UISectionAnchor } from "@guesant/saberes-ui";
import type { TopicSectionPanelProps } from "./topic-section-panel-props.interface";

export function TopicSectionPanel(props: TopicSectionPanelProps) {
  return (
    <UISectionAnchor
      ariaLabelledBy={props.labelledBy}
      hidden={!props.active}
      id={props.id}
      role="tabpanel"
      tabIndex={0}
    >
      {props.content}
    </UISectionAnchor>
  );
}
