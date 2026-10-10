import { useTranslation } from "react-i18next";
import { QuestionBackToPracticeAction } from "./question-back-to-practice-action.component";
import { QuestionSessionContinueAction } from "./question-session-continue-action.component";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";

export type QuestionSubmissionContinueProps = {
  result: QuestionSubmissionResult;
  onContinue?(result: QuestionSubmissionResult): Promise<void>;
};

export function QuestionSubmissionContinue(props: QuestionSubmissionContinueProps) {
  const { t } = useTranslation();

  if (!props.onContinue) {
    return <QuestionBackToPracticeAction />;
  }

  return <QuestionSessionContinueAction label={t("exercise.continueSession")} onContinue={props.onContinue} result={props.result} />;
}
