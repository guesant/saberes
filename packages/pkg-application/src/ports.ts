import type {
    AssessmentReadModel,
    CatalogFilters,
    CatalogReadModel,
    ContentKey,
    CourseReadModel,
    LessonReadModel,
    QuestionReadModel,
    StudyPlanReadModel,
    TopicMapReadModel,
} from "./models/content.ts";
import type {
    Attempt,
    DiagnosisRecord,
    ReviewTarget,
    StudyRecord,
    StudySession,
} from "./models/progress.ts";
import type { FsrsRating, PedagogicalAction } from "@guesant/saberes-domain";

export interface ContentPort {
    getCatalog(filters?: CatalogFilters): Promise<CatalogReadModel>;
    getCourse(slug: string): Promise<CourseReadModel | null>;
    getLesson(key: ContentKey | string): Promise<LessonReadModel | null>;
    getQuestion(key: ContentKey | string): Promise<QuestionReadModel | null>;
    getAssessment(key: ContentKey | string): Promise<AssessmentReadModel | null>;
    getTopicMap(mapKey: string): Promise<TopicMapReadModel | null>;
    getStudyPlan(slug?: string): Promise<StudyPlanReadModel>;
}

export interface ProgressPort {
    listAttempts(): Promise<Attempt[]>;
    recordAttempt(attempt: Attempt): Promise<Attempt>;
    saveAttempt(attempt: Attempt): Promise<Attempt>;
    saveSession(session: StudySession): Promise<void>;
    getSession(id: string): Promise<StudySession | undefined>;
    saveSetting(key: string, value: unknown): Promise<void>;
    getSetting(key: string): Promise<{ value?: unknown } | undefined>;
    clear(): Promise<void>;
    enrollCourse(
        contentKey: ContentKey | string,
        data?: Record<string, unknown>,
    ): Promise<StudyRecord>;
    listEnrollments(): Promise<StudyRecord[]>;
    saveLessonProgress(
        contentKey: ContentKey | string,
        data?: Record<string, unknown>,
    ): Promise<StudyRecord>;
    listLessonProgress(): Promise<StudyRecord[]>;
    savePlanProgress(
        contentKey: ContentKey | string,
        data?: Record<string, unknown>,
    ): Promise<StudyRecord>;
    listPlanProgress(): Promise<StudyRecord[]>;
    saveBookmark(
        contentKey: ContentKey | string,
        data?: Record<string, unknown>,
    ): Promise<StudyRecord>;
    listBookmarks(): Promise<StudyRecord[]>;
    saveReviewItem(
        contentKey: ContentKey | string,
        data?: Record<string, unknown>,
    ): Promise<StudyRecord>;
    listReviewItems(): Promise<StudyRecord[]>;
    saveReviewTarget(
        contentKey: ContentKey | string,
        data?: Partial<ReviewTarget>,
    ): Promise<ReviewTarget>;
    listReviewTargets(): Promise<ReviewTarget[]>;
    saveDiagnosis(diagnosis: DiagnosisRecord): Promise<void>;
    listDiagnoses(): Promise<DiagnosisRecord[]>;
    saveDailyChallenge(contentKey: string, data?: Record<string, unknown>): Promise<StudyRecord>;
    listDailyChallenges(): Promise<StudyRecord[]>;
    saveStreak(data?: Record<string, unknown>): Promise<StudyRecord>;
    getStreak(): Promise<StudyRecord | undefined>;
    saveAchievement(contentKey: string, data?: Record<string, unknown>): Promise<StudyRecord>;
    listAchievements(): Promise<StudyRecord[]>;
    listTopicMastery(): Promise<StudyRecord[]>;
}

export interface ReviewSchedulerPort {
    schedule(target: ReviewTarget, rating: FsrsRating, now?: Date): ReviewTarget;
    preview(target: ReviewTarget, now?: Date): Record<string, { dueAt: string; interval: number }>;
}

export interface ClockPort {
    now(): Date;
    dateKey(date?: Date): string;
}

export interface IdPort {
    create(): string;
}

export interface StudyPort {
    recordStudyActivity(activity?: { at?: Date | string; type?: string }): Promise<StudyRecord>;
    calculateTopicMastery(attempts?: Attempt[]): Record<string, Record<string, unknown>>;
    suggestDiagnosis(attempt: Pick<Attempt, "isCorrect" | "elapsedMs" | "attemptNumber">): string;
    actionForDiagnosis(code: string): PedagogicalAction;
    recommendNext(input?: Record<string, unknown>): Record<string, unknown> | null;
    scheduleReview(target: ReviewTarget, rating: FsrsRating, now?: Date): ReviewTarget;
    previewReview(
        target: ReviewTarget,
        now?: Date,
    ): Record<string, { dueAt: string; interval: number }>;
    achievementDefinitions(stats?: Record<string, number>): Array<Record<string, unknown>>;
    syncAchievements(stats?: Record<string, number>): Promise<Array<Record<string, unknown>>>;
    addStudyPoints(amount: number, reason: string): Promise<{ points: number; reason: string }>;
}

export interface ApplicationPorts {
    content: ContentPort;
    progress: ProgressPort;
    scheduler: ReviewSchedulerPort;
    study: StudyPort;
    clock: ClockPort;
    ids: IdPort;
}
