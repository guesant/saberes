import { UIStepper } from "@guesant/saberes-ui";
import { TopicMapNode } from "./topic-map-node.component";

export type TopicMapNodeListProps = {
  nodes: Array<Record<string, unknown>>;
};

export function TopicMapNodeList(props: TopicMapNodeListProps) {
  return (
    <UIStepper orientation="vertical" activeStep={-1}>
      {props.nodes.map((node) => {
        return <TopicMapNode key={String(node.curriculum_topic_id)} node={node} />;
      })}
    </UIStepper>
  );
}
