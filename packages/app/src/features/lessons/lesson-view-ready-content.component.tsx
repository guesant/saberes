import { LessonProgressError } from "./lesson-progress-error.component";
import { LessonReadyView } from "./lesson-ready-view.component";
import type { LessonViewReadyContentProps } from "./lesson-view-ready-content-props.interface";

export function LessonViewReadyContent(props: LessonViewReadyContentProps) {
  const { viewModel } = props;

  return (
    <>
      {viewModel.progressError ? <LessonProgressError error={viewModel.progressError} /> : null}
      <LessonReadyView
        data={props.data}
        completed={viewModel.completed}
        bookmarked={viewModel.bookmarked}
        bookmarkActionError={viewModel.bookmarkActionError}
        bookmarkActionState={viewModel.bookmarkActionState}
        progressActionError={viewModel.progressActionError}
        progressActionState={viewModel.progressActionState}
        sectionIndex={viewModel.sectionIndex}
        onComplete={viewModel.saveProgress}
        onBookmark={viewModel.saveBookmark}
        onSectionChange={viewModel.saveSection}
        onQuestion={props.onQuestion}
      />
    </>
  );
}
