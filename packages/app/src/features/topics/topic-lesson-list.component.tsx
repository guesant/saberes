import { UIContentGroup, UIList, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicLessonLink } from "./topic-lesson-link.component";
import type { TopicLessonListProps } from "./topic-lesson-list-props.type";

export function TopicLessonList(props: TopicLessonListProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="list">
      <UITypography variant="h5">{t("topics.lessons")}</UITypography>
      <UIList>
        {props.lessons.map((lesson) => (
          <TopicLessonLink key={String(lesson.id)} lesson={lesson} />
        ))}
      </UIList>
    </UIContentGroup>
  );
}
