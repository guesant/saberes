export type {
    AttemptRecord,
    DiagnosisRecord,
    LessonProgressRecord,
    PlanProgressRecord,
    ReviewTargetRecord,
} from "@guesant/saberes-domain";

export type {
    DiagnosisCode,
    DiagnosisConfidence,
    DiagnosisSource,
    FsrsRating,
    PedagogicalAction,
    ReviewState,
    ReviewTargetType,
} from "@guesant/saberes-domain";

export type Attempt = import("@guesant/saberes-domain").AttemptRecord;
export type ReviewTarget = import("@guesant/saberes-domain").ReviewTargetRecord & {
    fsrsCard?: unknown;
};

export interface StudySession {
    id: string;
    [key: string]: unknown;
}

export interface StudyRecord {
    contentKey?: string;
    [key: string]: unknown;
}
