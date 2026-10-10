import { UIButton, UIContentGroup, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { getQuestionResultAnswerKey } from "./get-question-result-answer-key.function";
import { QuestionAnswerKey } from "./question-answer-key.component";
import { QuestionDiagnosisPanel } from "./question-diagnosis-panel.component";
import { QuestionExplanation } from "./question-explanation.component";
import { QuestionResult } from "./question-result.component";
import { QuestionSolutions } from "./question-solutions.component";
import { QuestionSubmissionContinue } from "./question-submission-continue.component";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type { DiagnosisCode, QuestionReadModel } from "@guesant/saberes-application";

export type QuestionSubmissionFeedbackProps = {
  data: QuestionReadModel;
  onDiagnose(code: DiagnosisCode): Promise<void>;

  onRetry(): void;

  onContinue?(result: QuestionSubmissionResult): Promise<void>;
  result: QuestionSubmissionResult;
};

export function QuestionSubmissionFeedback(props: QuestionSubmissionFeedbackProps) {
  const { data, onDiagnose, onRetry, result } = props;

  const { t } = useTranslation();

  const answer = getQuestionResultAnswerKey(data, result.correct);

  const explanation = String(data.question.explanation || "");

  return (
    <UIContentGroup variant="content">
      <QuestionResult result={result.correct} />
      <QuestionAnswerKey answer={answer} />
      <QuestionExplanation explanation={explanation} />
      <QuestionSolutions solutions={data.solutions} />
      <QuestionDiagnosisPanel onDiagnose={onDiagnose} result={result.correct} />
      <UIInlineActions stacked>
        <QuestionSubmissionContinue onContinue={props.onContinue} result={result} />
        <UIButton variant="outlined" onClick={onRetry}>
          {t("exercise.retry")}
        </UIButton>
      </UIInlineActions>
    </UIContentGroup>
  );
}
