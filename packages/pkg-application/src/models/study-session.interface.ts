export interface StudySession {
  id: string;
  contentKey?: string;
  activityType?: "lesson" | "question" | "assessment" | "review";
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  [key: string]: unknown;
}
