import { UIContentGroup } from "@guesant/saberes-ui";
import { TopicMapNodeList } from "./topic-map-node-list.component";
import { TopicMapSummary } from "./topic-map-summary.component";
import type { TopicMapReadModel } from "@guesant/saberes-application";

type TopicMapColumnsProps = {
  data: TopicMapReadModel;
};

export function TopicMapColumns(props: TopicMapColumnsProps) {
  return (
    <UIContentGroup variant="section">
      <TopicMapNodeList nodes={props.data.nodes} />
      <TopicMapSummary nodeCount={props.data.nodes.length} edgeCount={props.data.edges.length} />
    </UIContentGroup>
  );
}
