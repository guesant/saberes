import { UIButton } from "@guesant/saberes-ui";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";

export type QuestionSessionContinueActionProps = {
  label: string;
  onContinue(result: QuestionSubmissionResult): Promise<void>;
  result: QuestionSubmissionResult;
};

export function QuestionSessionContinueAction(props: QuestionSessionContinueActionProps) {
  return (
    <UIButton
      variant="contained"
      onClick={() => {
        return props.onContinue(props.result);
      }}
    >
      {props.label}
    </UIButton>
  );
}
