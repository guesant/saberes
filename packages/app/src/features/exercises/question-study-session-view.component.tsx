import { useParams } from "react-router-dom";
import { createQuestionStudySessionScreenInput } from "./create-question-study-session-screen-input.function";
import { getQuestionStudySessionScreen } from "./get-question-study-session-screen.function";
import { QuestionStudySessionScreenView } from "./question-study-session-screen-view.component";
import { useQuestionStudySessionViewModel } from "./use-question-study-session-view-model.hook";

export function QuestionStudySessionView() {
  const { sessionId } = useParams();

  const viewModel = useQuestionStudySessionViewModel(sessionId);

  const screen = getQuestionStudySessionScreen(createQuestionStudySessionScreenInput(viewModel));

  return <QuestionStudySessionScreenView screen={screen} viewModel={viewModel} />;
}
