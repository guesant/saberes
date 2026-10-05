import { UIContentGroup, UISplitContentRow, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { LessonActions } from "./lesson-actions.component";
import type { LessonReadyHeaderProps } from "./lesson-ready-header-props.interface";

export function LessonReadyHeader(props: LessonReadyHeaderProps) {
  const { t } = useTranslation();

  return (
    <UISplitContentRow>
      <UIContentGroup variant="content">
        <UITypography variant="overline">{t("lesson.label")}</UITypography>
        <UITypography variant="h3">{String(props.data.lesson.title)}</UITypography>
        <UITypography color="text.secondary">{String(props.data.lesson.intro || "")}</UITypography>
      </UIContentGroup>
      <LessonActions
        completed={props.completed}
        bookmarked={props.bookmarked}
        bookmarkActionState={props.bookmarkActionState}
        onComplete={props.onComplete}
        onBookmark={props.onBookmark}
        progressActionState={props.progressActionState}
      />
    </UISplitContentRow>
  );
}
