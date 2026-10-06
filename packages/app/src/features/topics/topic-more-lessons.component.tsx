import { UIList, UIDialogAction } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicLessonLink } from "./topic-lesson-link.component";
import type { TopicLessonReadModel } from "@guesant/saberes-application";

export interface TopicMoreLessonsProps {
  lessons: TopicLessonReadModel[];
}

export function TopicMoreLessons(props: TopicMoreLessonsProps) {
  const { t } = useTranslation();

  return (
    <UIDialogAction label={t("discovery.moreLessons", { count: props.lessons.length })} title={t("discovery.theory")}>
      <UIList>{props.lessons.map((lesson) => { return <TopicLessonLink key={lesson.id} lesson={lesson} />; })}</UIList>
    </UIDialogAction>
  );
}
