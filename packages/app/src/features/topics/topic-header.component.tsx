import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicPrimaryActions } from "./topic-primary-actions.component";
import type { TopicReadModel } from "@guesant/saberes-application";

export interface TopicHeaderProps {
  topic: TopicReadModel["topic"];
}

export function TopicHeader(props: TopicHeaderProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography variant="overline">{t("topics.eyebrow")}</UITypography>
      <UITypography variant="h2">{props.topic.name}</UITypography>
      <UITypography color="text.secondary">{props.topic.description}</UITypography>
      <TopicPrimaryActions />
    </UIContentGroup>
  );
}
