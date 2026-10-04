import type { PerformanceTopicStat } from "./performance-topic-stat.interface";
import type { Attempt } from "@guesant/saberes-application";

export interface UpdatePerformanceTopicStatInput {
  attempt: Attempt;
  current: PerformanceTopicStat | undefined;
  topicId: string;
}
