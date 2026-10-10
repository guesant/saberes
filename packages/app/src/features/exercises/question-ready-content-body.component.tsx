import { UIContentGroup } from "@guesant/saberes-ui";
import { ActionFeedback } from "../../components/action-feedback.component";
import { QuestionContextDisclosure } from "./question-context-disclosure.component";
import { QuestionHeader } from "./question-header.component";
import { QuestionAssets } from "./question-assets.component";
import { QuestionReadyAnswerForm } from "./question-ready-answer-form.component";
import { QuestionReadyResult } from "./question-ready-result.component";
import { QuestionStimuli } from "./question-stimuli.component";
import { QuestionConsultationNotice } from "./question-consultation-notice.component";
import { QuestionConsultationDetails } from "./question-consultation-details.component";
import type { QuestionReadyContentBodyProps } from "./question-ready-content-body-props.interface";

export function QuestionReadyContentBody(props: QuestionReadyContentBodyProps) {
  const { content } = props;

  return (
    <UIContentGroup variant="section">
      <QuestionHeader data={content.data} />
      <QuestionConsultationNotice eligible={content.data.question.training_eligible} />

      <QuestionStimuli contexts={content.data.contexts || []} />
      <QuestionAssets pdfPages={content.data.pdfPages || []} />
      <QuestionConsultationDetails data={content.data} />

      <QuestionContextDisclosure
        bookmarkError={content.bookmarkError}
        bookmarked={content.bookmarked}
        bookmarkPending={content.bookmarkPending}
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
        readOnly={content.result !== null || content.data.question.training_eligible === false}
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
    </UIContentGroup>
  );
}
