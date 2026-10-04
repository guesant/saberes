import { useNavigate } from "react-router-dom";
import { QuestionStudySessionHeader } from "./question-study-session-header.component";
import { QuestionStudySessionSummary } from "./question-study-session-summary.component";
import type { QuestionStudySessionScreenViewProps } from "./question-study-session-screen-view-props.type";

export type QuestionStudySessionProgressViewProps = QuestionStudySessionScreenViewProps;

export function QuestionStudySessionProgressView(props: QuestionStudySessionProgressViewProps) {
  const navigate = useNavigate();

  const progress = props.viewModel.progress || {
    answered: 0,
    correct: 0,
    total: 0,
    percentage: 0,
  };

  if (props.screen === "completed") {
    return (
      <QuestionStudySessionSummary
        onBack={() => {
          return navigate("/meu-estudo");
        }}
        onReview={() => {
          return navigate("/revisoes");
        }}
        progress={progress}
      />
    );
  }

  return (
    <QuestionStudySessionHeader
      onPause={props.viewModel.pause}
      onResume={props.viewModel.resume}
      progress={progress}
      status="paused"
    />
  );
}
