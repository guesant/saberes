import { UIContentGroup, UIList } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicEmptySection } from "./topic-empty-section.component";
import { TopicLessonLink } from "./topic-lesson-link.component";
import { TopicMoreLessons } from "./topic-more-lessons.component";
import type { TopicLessonListProps } from "./topic-lesson-list-props.type";

export type TopicLessonPreviewProps = TopicLessonListProps;

export function TopicLessonPreview(props: TopicLessonPreviewProps) {
  const { t } = useTranslation();

  if (!props.lessons.length) {
    return <TopicEmptySection label={t("discovery.noTheory")} />;
  }

  return (
    <UIContentGroup variant="list">
      <UIList>{props.lessons.slice(0, 3)
        .map((lesson) => { return <TopicLessonLink key={lesson.id} lesson={lesson} />; })}</UIList>
      {props.lessons.length > 3 && <TopicMoreLessons lessons={props.lessons.slice(3)} />}
    </UIContentGroup>
  );
}
