import { UICard, UICardContent, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { QuestionBookmarkAction } from "./question-bookmark-action.component";
import { QuestionBookmarkError } from "./question-bookmark-error.component";
import { QuestionHeader } from "./question-header.component";
import { QuestionReadyAnswerForm } from "./question-ready-answer-form.component";
import { QuestionSubmissionFeedback } from "./question-submission-feedback.component";
import type { QuestionReadyContentProps } from "./question-ready-content-props.type";

export function QuestionReadyContent(props: QuestionReadyContentProps) {
  const { data, onDiagnose, onRetry, result } = props;

  const { t } = useTranslation();

  return (
    <UICard>
      <UICardContent>
        <UITypography variant="overline">{t("common.selectionProcess")}</UITypography>

        <QuestionHeader data={data} />

        <QuestionBookmarkAction bookmarked={props.bookmarked} onBookmark={props.onBookmark} />

        {props.bookmarkError ? (
          <QuestionBookmarkError error={props.bookmarkError} onRetry={props.onRetryBookmark} />
        ) : null}

        <QuestionReadyAnswerForm
          answer={props.answer}
          confidence={props.confidence}
          data={data}
          onAnswerChange={props.onAnswerChange}
          onConfidenceChange={props.onConfidenceChange}
          onSubmit={props.onSubmit}
        />

        {result !== null ? (
          <QuestionSubmissionFeedback
            data={data}
            onDiagnose={onDiagnose}
            onContinue={props.onContinue}
            onRetry={onRetry}
            result={result}
          />
        ) : null}
      </UICardContent>
    </UICard>
  );
}
