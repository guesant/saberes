import { UIButton, UIContentGroup } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { QuestionAnswerKey } from "./question-answer-key.component";
import { QuestionDiagnosisPanel } from "./question-diagnosis-panel.component";
import { QuestionExplanation } from "./question-explanation.component";
import { QuestionResult } from "./question-result.component";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type { DiagnosisCode, QuestionReadModel } from "@guesant/saberes-application";

export type QuestionSubmissionFeedbackProps = {
  data: QuestionReadModel;
  onDiagnose: (code: DiagnosisCode) => Promise<void>;
  onRetry: () => void;
  result: QuestionSubmissionResult;
};

export function QuestionSubmissionFeedback(props: QuestionSubmissionFeedbackProps) {
  const { data, onDiagnose, onRetry, result } = props;

  const { t } = useTranslation();

  const answer = result.correct === false ? String(data.question.correct_answer || "") : "";

  const explanation = String(data.question.explanation || "");

  return (
    <UIContentGroup variant="content">
      <QuestionResult result={result.correct} />
      <QuestionAnswerKey answer={answer} />
      <QuestionExplanation explanation={explanation} />
      <QuestionDiagnosisPanel onDiagnose={onDiagnose} />
      <UIButton variant="outlined" onClick={onRetry}>
        {t("exercise.retry")}
      </UIButton>
    </UIContentGroup>
  );
}
