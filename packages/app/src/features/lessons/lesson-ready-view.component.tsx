import { getLessonPracticeHref } from "./get-lesson-practice-href.function";
import { LessonActionFeedback } from "./lesson-action-feedback.component";
import { LessonReadyFooter } from "./lesson-ready-footer.component";
import { LessonReadyHeader } from "./lesson-ready-header.component";
import { LessonReadySecondaryContent } from "./lesson-ready-secondary-content.component";
import { LessonSections } from "./lesson-sections.component";
import { useLessonResume } from "./use-lesson-resume.hook";
import type { ActionState } from "../../types/action-state.type";
import type { LessonReadModel } from "@guesant/saberes-application";

export type LessonReadyViewProps = {
  data: LessonReadModel;
  completed: boolean;
  bookmarked: boolean;
  bookmarkActionError: Error | null;
  bookmarkActionState: ActionState;
  progressActionError: Error | null;
  progressActionState: ActionState;
  sectionIndex: number | undefined;
  onComplete(value: boolean): Promise<void>;

  onBookmark(): Promise<void>;

  onSectionChange(sectionIndex: number): Promise<void>;

  onQuestion(questionId: string | number): void;
};

export function LessonReadyView(props: LessonReadyViewProps) {
  const { data, completed, bookmarked, onComplete, onBookmark, onQuestion } = props;

  useLessonResume({ sections: data.sections, sectionIndex: props.sectionIndex });

  return (
    <>
      <LessonReadyHeader
        data={data}
        completed={completed}
        bookmarked={bookmarked}
        bookmarkActionState={props.bookmarkActionState}
        onComplete={onComplete}
        onBookmark={onBookmark}
        progressActionState={props.progressActionState}
      />

      <LessonActionFeedback
        bookmarkError={props.bookmarkActionError}
        bookmarkState={props.bookmarkActionState}
        progressError={props.progressActionError}
        progressState={props.progressActionState}
      />

      <LessonReadySecondaryContent
        data={data}
        sectionIndex={props.sectionIndex}
        onSectionChange={props.onSectionChange}
      />

      <LessonSections sections={data.sections} onQuestion={onQuestion} />

      <LessonReadyFooter practiceHref={getLessonPracticeHref(data.topics)} />
    </>
  );
}
