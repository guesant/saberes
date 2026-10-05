import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicLessonList } from "./topic-lesson-list.component";
import { TopicNavigationList } from "./topic-navigation-list.component";
import { TopicQuestionList } from "./topic-question-list.component";
import { TopicRelatedList } from "./topic-related-list.component";
import type { TopicReadyViewProps } from "./topic-ready-view-props.type";

export function TopicReadyView(props: TopicReadyViewProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="section">
      <UIContentGroup variant="content">
        <UITypography variant="overline">{t("topics.eyebrow")}</UITypography>
        <UITypography variant="h2">{String(props.data.topic.name)}</UITypography>
        <UITypography color="text.secondary">
          {String(props.data.topic.description || "")}
        </UITypography>
      </UIContentGroup>

      {props.data.prerequisites.length ? (
        <TopicNavigationList title={t("topics.prerequisites")} topics={props.data.prerequisites} />
      ) : null}

      {props.data.children.length ? (
        <TopicNavigationList title={t("topics.children")} topics={props.data.children} />
      ) : null}

      <TopicLessonList lessons={props.data.lessons} />
      <TopicQuestionList questions={props.data.questions} />

      {props.data.related.length ? <TopicRelatedList topics={props.data.related} /> : null}
    </UIContentGroup>
  );
}
