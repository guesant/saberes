import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicLessonList } from "./topic-lesson-list.component";
import { TopicNavigationDisclosure } from "./topic-navigation-disclosure.component";
import { TopicQuestionList } from "./topic-question-list.component";
import { TopicRelatedDisclosure } from "./topic-related-disclosure.component";
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

      <TopicNavigationDisclosure
        childrenTopics={props.data.children}
        prerequisites={props.data.prerequisites}
      />

      <TopicLessonList lessons={props.data.lessons} />
      <TopicQuestionList questions={props.data.questions} />

      <TopicRelatedDisclosure topics={props.data.related} />
    </UIContentGroup>
  );
}
