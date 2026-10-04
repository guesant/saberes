import {
  UIButton,
  UIContentGroup,
  UIDivider,
  UIPaper,
  UISplitContentRow,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { LessonActions } from "./lesson-actions.component";
import { LessonEditorialMetadataPanel } from "./lesson-editorial-metadata-panel.component";
import { LessonSectionNavigation } from "./lesson-section-navigation.component";
import { LessonSections } from "./lesson-sections.component";
import { useLessonResume } from "./use-lesson-resume.hook";
import type { LessonReadModel } from "@guesant/saberes-application";

export type LessonReadyViewProps = {
  data: LessonReadModel;
  completed: boolean;
  bookmarked: boolean;
  sectionIndex: number | undefined;
  onComplete: (value: boolean) => Promise<void>;
  onBookmark: () => Promise<void>;
  onSectionChange: (sectionIndex: number) => Promise<void>;
  onQuestion: (questionId: string | number) => void;
};

export function LessonReadyView(props: LessonReadyViewProps) {
  const { data, completed, bookmarked, onComplete, onBookmark, onQuestion } = props;

  useLessonResume({ sections: data.sections, sectionIndex: props.sectionIndex });

  const { t } = useTranslation();

  return (
    <>
      <UISplitContentRow>
        <UIContentGroup variant="tight">
          <UITypography variant="overline">{t("lesson.label")}</UITypography>

          <UITypography variant="h3">{String(data.lesson.title)}</UITypography>

          <UITypography color="text.secondary">{String(data.lesson.intro || "")}</UITypography>
        </UIContentGroup>

        <LessonActions
          completed={completed}
          bookmarked={bookmarked}
          onComplete={onComplete}
          onBookmark={onBookmark}
        />
      </UISplitContentRow>

      <LessonEditorialMetadataPanel data={data} />

      <UIPaper variant="outlined">
        <LessonSectionNavigation
          sections={data.sections}
          selectedIndex={props.sectionIndex}
          onSectionSelect={props.onSectionChange}
        />
      </UIPaper>

      <UIPaper>
        <LessonSections sections={data.sections} onQuestion={onQuestion} />
      </UIPaper>

      <UIDivider />

      <UIButton variant="contained">{t("lesson.practice")}</UIButton>
    </>
  );
}
