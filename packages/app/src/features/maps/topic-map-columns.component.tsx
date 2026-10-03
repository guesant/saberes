import { Grid, Paper } from "@guesant/saberes-ui";
import { TopicMapNodeList } from "./topic-map-node-list.component";
import { TopicMapSummary } from "./topic-map-summary.component";
import type { TopicMapReadModel } from "@guesant/saberes-application";

type TopicMapColumnsProps = {
  data: TopicMapReadModel;
};

export function TopicMapColumns(props: TopicMapColumnsProps) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper>
          <TopicMapNodeList nodes={props.data.nodes} />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <TopicMapSummary nodeCount={props.data.nodes.length} edgeCount={props.data.edges.length} />
      </Grid>
    </Grid>
  );
}
