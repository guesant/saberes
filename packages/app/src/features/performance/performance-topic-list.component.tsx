import { UICard, UICardContent, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PerformanceTopicContent } from "./performance-topic-content.component";
import type { PerformanceTopicStat } from "./performance-topic-stat.interface";

export type PerformanceTopicListProps = {
  stats: PerformanceTopicStat[];
};

export function PerformanceTopicList(props: PerformanceTopicListProps) {
  const { t } = useTranslation();

  return (
    <UICard>
      <UICardContent>
        <UIContentGroup variant="content">
          <UITypography variant="h5">{t("performance.byTopic")}</UITypography>
          <PerformanceTopicContent stats={props.stats} />
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
