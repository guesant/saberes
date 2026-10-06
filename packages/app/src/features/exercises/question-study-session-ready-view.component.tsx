import { UIContentGroup } from "@guesant/saberes-ui";
import { QuestionReadyView } from "./question-ready-view.component";
import { QuestionStudySessionHeader } from "./question-study-session-header.component";
import { QuestionStudySessionSkipAction } from "./question-study-session-skip-action.component";
import type { QuestionStudySessionReadyViewProps } from "./question-study-session-ready-view-props.type";

export function QuestionStudySessionReadyView(props: QuestionStudySessionReadyViewProps) {
  const { question, progress, pause, advance, skip } = props.viewModel;

  if (!question.data) {
    return null;
  }

  return (
    <UIContentGroup variant="section">
      <QuestionStudySessionHeader
        onPause={pause}
        onResume={props.viewModel.resume}
        progress={progress || { answered: 0, correct: 0, total: 0, percentage: 0 }}
        remainingSeconds={props.viewModel.remainingSeconds}
        status="active"
      />
      <QuestionReadyView
        bookmarkError={question.bookmarkError}
        bookmarked={question.bookmarked}
        bookmarkPending={question.bookmarkPending}
        data={question.data}
        onBookmark={question.toggleBookmark}
        onContinue={advance}
        onDiagnose={question.saveDiagnosis}
        onPriorKnowledge={question.savePriorKnowledge}
        onRetryBookmark={question.reload}
        onSubmit={question.submit}
      />
      <QuestionStudySessionSkipAction onSkip={skip} />
    </UIContentGroup>
  );
}
