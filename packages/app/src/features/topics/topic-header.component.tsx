import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicCurriculumSummary } from "./topic-curriculum-summary.component";
import { TopicPrimaryActions } from "./topic-primary-actions.component";
import type { TopicReadModel } from "@guesant/saberes-application";

export interface TopicHeaderProps {
  activeSection: number;
  navigateToSection(index: number): void;
  curriculum?: TopicReadModel["curriculum"];
  topic: TopicReadModel["topic"];
}

export function TopicHeader(props: TopicHeaderProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography variant="overline">{t("topics.eyebrow")}</UITypography>
      <UITypography variant="h2">{props.topic.name}</UITypography>
      <UITypography color="text.secondary">{props.topic.description}</UITypography>
      {props.curriculum ? <TopicCurriculumSummary curriculum={props.curriculum} /> : null}
      <TopicPrimaryActions
        activeSection={props.activeSection}
        navigateToSection={props.navigateToSection}
      />
    </UIContentGroup>
  );
}
