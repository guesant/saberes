import { isQuestionStudySessionFallbackScreen } from "./is-question-study-session-fallback-screen.function";
import { isQuestionStudySessionProgressScreen } from "./is-question-study-session-progress-screen.function";
import { QuestionStudySessionFallbackView } from "./question-study-session-fallback-view.component";
import { QuestionStudySessionProgressView } from "./question-study-session-progress-view.component";
import { QuestionStudySessionQuestionView } from "./question-study-session-question-view.component";
import type { QuestionStudySessionScreenViewProps as ScreenViewProps } from "./question-study-session-screen-view-props.type";

export type QuestionStudySessionScreenViewProps = ScreenViewProps;

export function QuestionStudySessionScreenView(props: QuestionStudySessionScreenViewProps) {
  if (isQuestionStudySessionFallbackScreen(props.screen)) {
    return <QuestionStudySessionFallbackView screen={props.screen} viewModel={props.viewModel} />;
  }

  if (isQuestionStudySessionProgressScreen(props.screen)) {
    return <QuestionStudySessionProgressView screen={props.screen} viewModel={props.viewModel} />;
  }

  return <QuestionStudySessionQuestionView screen={props.screen} viewModel={props.viewModel} />;
}
