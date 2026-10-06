import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicLessonPreview } from "./topic-lesson-preview.component";
import type { TopicLessonListProps } from "./topic-lesson-list-props.type";

export function TopicLessonList(props: TopicLessonListProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup id="teoria" variant="section">
      <UITypography variant="h5">{t("discovery.theory")}</UITypography>
      <TopicLessonPreview lessons={props.lessons} />
    </UIContentGroup>
  );
}
