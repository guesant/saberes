import { useRef, useState } from "react";
import { QuestionReadyContent } from "./question-ready-content.component";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type {
  AttemptConfidence,
  DiagnosisCode,
  QuestionReadModel,
} from "@guesant/saberes-application";

export type QuestionReadyViewProps = {
  bookmarkError: Error | null;
  bookmarked: boolean;
  data: QuestionReadModel;
  onDiagnose: (code: DiagnosisCode) => Promise<void>;
  onBookmark: () => Promise<void>;
  onRetryBookmark: () => Promise<void>;
  onSubmit: (
    answer: string,
    elapsedMs: number,
    confidence: AttemptConfidence,
  ) => Promise<QuestionSubmissionResult>;
};

export function QuestionReadyView(props: QuestionReadyViewProps) {
  const { data, onDiagnose, onSubmit } = props;

  const [answer, setAnswer] = useState<string | null>(null);

  const [confidence, setConfidence] = useState<AttemptConfidence | null>(null);

  const [result, setResult] = useState<QuestionSubmissionResult | null>(null);

  const startedAt = useRef(Date.now());

  const handleSubmit = async () => {
    if (answer?.trim() && confidence) {
      setResult(await onSubmit(answer.trim(), Date.now() - startedAt.current, confidence));
    }
  };

  const handleRetry = () => {
    setAnswer(null);

    setConfidence(null);

    setResult(null);

    startedAt.current = Date.now();
  };

  return (
    <QuestionReadyContent
      answer={answer}
      bookmarkError={props.bookmarkError}
      bookmarked={props.bookmarked}
      confidence={confidence}
      data={data}
      onAnswerChange={setAnswer}
      onBookmark={props.onBookmark}
      onRetryBookmark={props.onRetryBookmark}
      onConfidenceChange={setConfidence}
      onDiagnose={onDiagnose}
      onRetry={handleRetry}
      onSubmit={handleSubmit}
      result={result}
    />
  );
}
