import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import type { QuestionStudySessionStateProps } from "./question-study-session-state-props.interface";

export function QuestionStudySessionState(props: QuestionStudySessionStateProps) {
  if (props.loading) {
    return <ContentLoadingState label={props.label} />;
  }

  if (props.error) {
    return <ContentErrorState error={props.error} onRetry={props.onRetry} />;
  }

  return <ContentNotFoundState label={props.notFoundLabel} />;
}
