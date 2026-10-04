import { QuestionReadyContent } from "./question-ready-content.component";
import { useQuestionReadyInteraction } from "./use-question-ready-interaction.hook";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type {
  AttemptConfidence,
  DiagnosisCode,
  PriorKnowledgeStatus,
  QuestionReadModel,
} from "@guesant/saberes-application";

export type QuestionReadyViewProps = {
  bookmarkError: Error | null;
  bookmarked: boolean;
  data: QuestionReadModel;
  onDiagnose(code: DiagnosisCode): Promise<void>;

  onPriorKnowledge(status: PriorKnowledgeStatus): Promise<void>;

  onBookmark(): Promise<void>;

  onRetryBookmark(): Promise<void>;

  onContinue?(result: QuestionSubmissionResult): Promise<void>;

  onSubmit(
    answer: string,
    elapsedMs: number,
    confidence: AttemptConfidence,
  ): Promise<QuestionSubmissionResult>;
};

export function QuestionReadyView(props: QuestionReadyViewProps) {
  const interaction = useQuestionReadyInteraction({ onSubmit: props.onSubmit });

  return (
    <QuestionReadyContent
      answer={interaction.answer}
      bookmarkError={props.bookmarkError}
      bookmarked={props.bookmarked}
      confidence={interaction.confidence}
      data={props.data}
      onAnswerChange={interaction.changeAnswer}
      onBookmark={props.onBookmark}
      onRetryBookmark={props.onRetryBookmark}
      onConfidenceChange={interaction.changeConfidence}
      onContinue={props.onContinue}
      onDiagnose={props.onDiagnose}
      onPriorKnowledge={props.onPriorKnowledge}
      onRetry={interaction.clear}
      onSubmit={interaction.submit}
      result={interaction.result}
    />
  );
}
