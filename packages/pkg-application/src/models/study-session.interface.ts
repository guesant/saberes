import type { StudySessionStatus } from "./study-session-status.type";

export interface StudySession {
  id: string;
  contentKey?: string;
  activityType?: "lesson" | "question" | "assessment" | "review";
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  questionKeys?: string[];
  currentIndex?: number;
  status?: StudySessionStatus;
  answeredQuestionKeys?: string[];
  correctAnswers?: number;
  [key: string]: unknown;
}
