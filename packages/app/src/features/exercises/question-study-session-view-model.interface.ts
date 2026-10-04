import { useQuestionViewModel } from "./question.view-model";
import type { QuestionSessionProgress } from "./get-question-session-progress.function";
import type { QuestionStudySessionViewModelState } from "./question-study-session-view-model-state.type";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type { StudySession } from "@guesant/saberes-application";

export interface QuestionStudySessionViewModel {
  state: QuestionStudySessionViewModelState;
  session: StudySession | null;
  question: ReturnType<typeof useQuestionViewModel>;
  progress: QuestionSessionProgress | null;
  remainingSeconds: number | null;
  error: Error | null;
  reload(): Promise<void>;

  pause(): Promise<void>;

  resume(): Promise<void>;

  advance(result: QuestionSubmissionResult): Promise<void>;

  skip(): Promise<void>;
}
