import { PerformanceTopicEmptyState } from "./performance-topic-empty-state.component";
import { PerformanceTopicRows } from "./performance-topic-rows.component";
import type { PerformanceTopicStat } from "./performance-topic-stat.interface";

export type PerformanceTopicContentProps = {
  stats: PerformanceTopicStat[];
};

export function PerformanceTopicContent(props: PerformanceTopicContentProps) {
  return props.stats.length ? (
    <PerformanceTopicRows stats={props.stats} />
  ) : (
    <PerformanceTopicEmptyState />
  );
}
