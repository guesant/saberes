import type { StudyRecord } from "@guesant/saberes-application";

export function getPerformanceMasteredTopicCount(topicMastery: StudyRecord[]): number {
  return topicMastery.filter((record) => {
    return record.learningState === "mastered";
  }).length;
}
