import { isQuestionStudySessionCompleted } from "./is-question-study-session-completed.function";
import { isQuestionStudySessionPaused } from "./is-question-study-session-paused.function";
import type { GetQuestionStudySessionScreenInput } from "./get-question-study-session-screen.function";
import type { QuestionStudySessionViewModel } from "./question-study-session-view-model.interface";

export function createQuestionStudySessionScreenInput(
  viewModel: QuestionStudySessionViewModel,
): GetQuestionStudySessionScreenInput {
  const { session } = viewModel;

  return {
    completed: isQuestionStudySessionCompleted(session),
    hasQuestion: Boolean(viewModel.question.data),
    hasSession: Boolean(session),
    paused: isQuestionStudySessionPaused(session),
    questionState: viewModel.question.state,
    sessionState: viewModel.state,
  };
}
