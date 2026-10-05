import { QuestionSubmissionFeedback } from "./question-submission-feedback.component";
import type { QuestionReadyResultProps } from "./question-ready-result-props.type";

export function QuestionReadyResult(props: QuestionReadyResultProps) {
  if (props.result === null) {
    return null;
  }

  return (
    <QuestionSubmissionFeedback
      data={props.data}
      onDiagnose={props.onDiagnose}
      onContinue={props.onContinue}
      onRetry={props.onRetry}
      result={props.result}
    />
  );
}
