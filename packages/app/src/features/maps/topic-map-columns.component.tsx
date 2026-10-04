import { UIPaper, UITwoColumnLayout } from "@guesant/saberes-ui";
import { TopicMapNodeList } from "./topic-map-node-list.component";
import { TopicMapSummary } from "./topic-map-summary.component";
import type { TopicMapReadModel } from "@guesant/saberes-application";

type TopicMapColumnsProps = {
  data: TopicMapReadModel;
};

export function TopicMapColumns(props: TopicMapColumnsProps) {
  return (
    <UITwoColumnLayout
      primary={
        <UIPaper>
          <TopicMapNodeList nodes={props.data.nodes} />
        </UIPaper>
      }
      secondary={
        <TopicMapSummary nodeCount={props.data.nodes.length} edgeCount={props.data.edges.length} />
      }
    />
  );
}
