import type { SimulationAnswer } from "./simulation-answer.interface";
import type { SimulationQuestionResult } from "./simulation-question-result.interface";
import type { SimulationQuestionWeight } from "./simulation-question-weight.interface";
import type { StudyQuestionContext } from "./study-question-context.interface";
import type { StudySessionMode } from "./study-session-mode.type";
import type { StudySessionStatus } from "./study-session-status.type";

export interface StudySession {
  id: string;
  mode?: StudySessionMode;
  revision?: number;
  simulationAnswers?: SimulationAnswer[];
  questionContexts?: Record<string, StudyQuestionContext>;
  contentReleaseVersion?: string;
  targetEditionKey?: string;
  targetStageKey?: string;
  blueprintId?: number | string;
  blueprintVersion?: string;
  selectionSeed?: string;
  flaggedQuestionKeys?: string[];
  simulationResults?: SimulationQuestionResult[];
  questionWeights?: SimulationQuestionWeight[];
  cancelledQuestionPolicy?: "award_max_points";
  completionReason?: "submitted" | "expired";
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
