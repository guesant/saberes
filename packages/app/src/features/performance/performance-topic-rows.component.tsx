import { PerformanceTopicStatRow } from "./performance-topic-stat-row.component";
import type { PerformanceTopicStat } from "./performance-topic-stat.interface";

export type PerformanceTopicRowsProps = {
  stats: PerformanceTopicStat[];
};

export function PerformanceTopicRows(props: PerformanceTopicRowsProps) {
  return props.stats
    .slice(0, 8)
    .map((stat) => <PerformanceTopicStatRow key={stat.topicId} stat={stat} />);
}
