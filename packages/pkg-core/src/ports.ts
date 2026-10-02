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
    AttemptRecord,
    DiagnosisRecord,
    LessonProgressRecord,
    PlanProgressRecord,
    ReviewTargetRecord,
} from "./models/progress.ts";
import type { FsrsRating } from "./models/enums.ts";

export interface ContentPort {
    getCatalog(filters?: CatalogFilters): Promise<CatalogReadModel>;
    getCourse(slug: string): Promise<CourseReadModel | null>;
    getLesson(key: ContentKey | string): Promise<LessonReadModel | null>;
    getQuestion(key: ContentKey | string): Promise<QuestionReadModel | null>;
    getAssessment(
        key: ContentKey | string,
    ): Promise<AssessmentReadModel | null>;
    getTopicMap(mapKey: string): Promise<TopicMapReadModel | null>;
    getStudyPlan(slug?: string): Promise<StudyPlanReadModel>;
}

export interface ProgressPort {
    listAttempts(): Promise<AttemptRecord[]>;
    recordAttempt(attempt: AttemptRecord): Promise<void>;
    enrollCourse(
        contentKey: ContentKey | string,
        data?: Record<string, unknown>,
    ): Promise<void>;
    listLessonProgress(): Promise<LessonProgressRecord[]>;
    saveLessonProgress(progress: LessonProgressRecord): Promise<void>;
    saveBookmark(
        contentKey: ContentKey | string,
        data?: Record<string, unknown>,
    ): Promise<void>;
    listPlanProgress(): Promise<PlanProgressRecord[]>;
    savePlanProgress(progress: PlanProgressRecord): Promise<void>;
    listReviewTargets(): Promise<ReviewTargetRecord[]>;
    saveReviewTarget(target: ReviewTargetRecord): Promise<void>;
    saveDiagnosis(diagnosis: DiagnosisRecord): Promise<void>;
}

export interface ReviewPreview {
    [rating: string]: { dueAt: string; interval: number };
}

export interface ReviewSchedulerPort {
    schedule(
        target: ReviewTargetRecord,
        rating: FsrsRating,
        now: Date,
    ): ReviewTargetRecord;
    preview(target: ReviewTargetRecord, now: Date): ReviewPreview;
}

export interface ClockPort {
    now(): Date;
    dateKey(date?: Date): string;
}

export interface IdPort {
    create(): string;
}

export interface AppDependencies {
    content: ContentPort;
    progress: ProgressPort;
    scheduler: ReviewSchedulerPort;
    clock: ClockPort;
    ids: IdPort;
}
