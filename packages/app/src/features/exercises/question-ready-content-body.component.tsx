import { UICardContent, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { ActionFeedback } from "../../components/action-feedback.component";
import { QuestionContextDisclosure } from "./question-context-disclosure.component";
import { QuestionHeader } from "./question-header.component";
import { QuestionReadyAnswerForm } from "./question-ready-answer-form.component";
import { QuestionReadyResult } from "./question-ready-result.component";
import type { QuestionReadyContentBodyProps } from "./question-ready-content-body-props.interface";

export function QuestionReadyContentBody(props: QuestionReadyContentBodyProps) {
  const { content } = props;

  const { t } = useTranslation();

  return (
    <UICardContent>
      <UITypography variant="overline">{t("common.selectionProcess")}</UITypography>

      <QuestionHeader data={content.data} />

      <QuestionContextDisclosure
        bookmarkError={content.bookmarkError}
        bookmarked={content.bookmarked}
        onBookmark={content.onBookmark}
        onPriorKnowledge={content.onPriorKnowledge}
        onRetryBookmark={content.onRetryBookmark}
      />

      <QuestionReadyAnswerForm
        answer={content.answer}
        confidence={content.confidence}
        data={content.data}
        onAnswerChange={content.onAnswerChange}
        onConfidenceChange={content.onConfidenceChange}
        onSubmit={content.onSubmit}
        submitting={content.submissionState === "saving"}
      />

      <ActionFeedback error={content.submissionError} state={content.submissionState} />

      <QuestionReadyResult
        data={content.data}
        onDiagnose={content.onDiagnose}
        onContinue={content.onContinue}
        onRetry={content.onRetry}
        result={content.result}
      />
    </UICardContent>
  );
}
