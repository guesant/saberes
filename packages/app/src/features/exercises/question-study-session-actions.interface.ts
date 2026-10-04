import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type { StudySession } from "@guesant/saberes-application";

export interface QuestionStudySessionActions {
  pause(session: StudySession): Promise<void>;

  resume(session: StudySession): Promise<void>;

  advance(
    session: StudySession,
    questionKey: string,
    result: QuestionSubmissionResult,
  ): Promise<void>;

  skip(session: StudySession, questionKey: string): Promise<void>;

  complete(session: StudySession): Promise<void>;
}
