import { UIContentGroup } from "@guesant/saberes-ui";
import { QuestionReadyView } from "./question-ready-view.component";
import { QuestionStudySessionHeader } from "./question-study-session-header.component";
import type { QuestionStudySessionReadyViewProps } from "./question-study-session-ready-view-props.type";

export function QuestionStudySessionReadyView(props: QuestionStudySessionReadyViewProps) {
  const { question, progress, pause, advance } = props.viewModel;

  if (!question.data) {
    return null;
  }

  return (
    <UIContentGroup variant="section">
      <QuestionStudySessionHeader
        onPause={pause}
        onResume={props.viewModel.resume}
        progress={progress || { answered: 0, correct: 0, total: 0, percentage: 0 }}
        status="active"
      />
      <QuestionReadyView
        bookmarkError={question.bookmarkError}
        bookmarked={question.bookmarked}
        data={question.data}
        onBookmark={question.saveBookmark}
        onContinue={advance}
        onDiagnose={question.saveDiagnosis}
        onRetryBookmark={question.reload}
        onSubmit={question.submit}
      />
    </UIContentGroup>
  );
}
