import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { PerformanceTopicStat } from "./performance-topic-stat.interface";

export type PerformanceTopicStatRowProps = {
  stat: PerformanceTopicStat;
};

export function PerformanceTopicStatRow(props: PerformanceTopicStatRowProps) {
  const { t } = useTranslation();

  return (
    <UITypography color="text.secondary">
      {t("performance.topicRow", {
        accuracy: props.stat.accuracy,
        attempts: props.stat.attempts,
        incorrect: props.stat.incorrect,
        topic: props.stat.topicId,
      })}
    </UITypography>
  );
}
