import { createQuestionStudySessionScreenInput } from "./create-question-study-session-screen-input.function";
import { getQuestionStudySessionScreen } from "./get-question-study-session-screen.function";
import { QuestionStudySessionScreenView } from "./question-study-session-screen-view.component";
import { useQuestionStudySessionViewModel } from "./use-question-study-session-view-model.hook";
import type { PracticeQuestionStudySessionViewProps } from "./practice-question-study-session-view-props.interface";

export function PracticeQuestionStudySessionView(props: PracticeQuestionStudySessionViewProps) {
  const viewModel = useQuestionStudySessionViewModel(props.sessionId);

  const screen = getQuestionStudySessionScreen(createQuestionStudySessionScreenInput(viewModel));

  return <QuestionStudySessionScreenView screen={screen} viewModel={viewModel} />;
}
