import type { StudySessionMode } from "@guesant/saberes-application";

export interface QuestionStudySessionContentProps {
  mode: StudySessionMode | undefined;
  sessionId: string;
}
