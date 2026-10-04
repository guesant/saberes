import type { StudySessionStatus } from "./study-session-status.type";

export interface StudySession {
  id: string;
  contentKey?: string;
  activityType?: "lesson" | "question" | "assessment" | "review";
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  timeLimitMs?: number;
  expiresAt?: string;
  questionKeys?: string[];
  currentIndex?: number;
  status?: StudySessionStatus;
  answeredQuestionKeys?: string[];
  skippedQuestionKeys?: string[];
  correctAnswers?: number;
  [key: string]: unknown;
}
