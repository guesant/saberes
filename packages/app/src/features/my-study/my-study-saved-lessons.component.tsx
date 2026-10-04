import { UICard, UICardContent, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { MyStudySavedLessonItem } from "./my-study-saved-lesson-item.component";
import type { CatalogCard } from "@guesant/saberes-application";

export type MyStudySavedLessonsProps = {
  lessons: CatalogCard[];
};

export function MyStudySavedLessons(props: MyStudySavedLessonsProps) {
  const { t } = useTranslation();

  return (
    <UICard>
      <UICardContent>
        <UIContentGroup variant="content">
          <UITypography variant="h5">{t("home.savedLessons")}</UITypography>
          {props.lessons.map((lesson) => (
            <MyStudySavedLessonItem key={String(lesson.id)} lesson={lesson} />
          ))}
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
