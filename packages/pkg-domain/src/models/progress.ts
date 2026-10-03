import type { ContentKey } from "./content.ts";
import type {
    DiagnosisCode,
    DiagnosisConfidence,
    DiagnosisSource,
    PedagogicalAction,
    ReviewState,
    ReviewTargetType,
} from "./enums.ts";

export interface AttemptRecord {
    id?: string;
    contentKey?: ContentKey | string;
    questionId?: number | string;
    topicIds?: Array<number | string>;
    answer?: unknown;
    isCorrect?: boolean | null;
    elapsedMs?: number;
    attemptNumber?: number;
    sessionId?: string;
    source?: string;
    answeredAt?: string;
    diagnosis?: DiagnosisCode;
    [key: string]: unknown;
}

export interface LessonProgressRecord {
    contentKey: ContentKey | string;
    lessonId?: number | string;
    completed?: boolean;
    [key: string]: unknown;
}

export interface PlanProgressRecord {
    contentKey: ContentKey | string;
    planId?: number | string;
    stepId?: number | string;
    completed?: boolean;
    [key: string]: unknown;
}

export interface ReviewTargetRecord {
    contentKey: ContentKey | string;
    targetType?: ReviewTargetType;
    dueAt?: string;
    state?: ReviewState;
    suspended?: boolean;
    [key: string]: unknown;
}

export interface DiagnosisRecord {
    attemptId: string;
    code: DiagnosisCode;
    confidence?: DiagnosisConfidence;
    suggestedBy?: DiagnosisSource;
    action?: PedagogicalAction;
    createdAt?: string;
}
