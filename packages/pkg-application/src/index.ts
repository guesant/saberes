import type { ContentKey, CatalogFilters } from "@guesant/saberes-domain";
import type { ApplicationPorts } from "./ports.ts";
import type {
    CatalogReadModel,
    CourseReadModel,
    LessonReadModel,
    QuestionReadModel,
    StudyPlanReadModel,
    TopicMapReadModel,
} from "./models/content.ts";
import type { Attempt } from "./models/progress.ts";

export * from "./models/content.ts";
export * from "./models/progress.ts";
export * from "./ports.ts";

export interface ApplicationServices {
    catalog: {
        get(filters?: CatalogFilters): Promise<CatalogReadModel>;
    };
    courses: {
        get(slug: string): Promise<CourseReadModel | null>;
        enroll(contentKey: ContentKey | string, data?: Record<string, unknown>): Promise<unknown>;
    };
    lessons: {
        get(key: ContentKey | string): Promise<LessonReadModel | null>;
        saveProgress(
            contentKey: ContentKey | string,
            data?: Record<string, unknown>,
        ): Promise<unknown>;
        bookmark(contentKey: ContentKey | string, data?: Record<string, unknown>): Promise<unknown>;
    };
    exercises: {
        get(key: ContentKey | string): Promise<QuestionReadModel | null>;
        recordAttempt(attempt: Attempt): Promise<Attempt>;
    };
    maps: {
        get(mapKey: string): Promise<TopicMapReadModel | null>;
    };
    studyPlans: {
        get(slug?: string): Promise<StudyPlanReadModel>;
        saveProgress(
            contentKey: ContentKey | string,
            data?: Record<string, unknown>,
        ): Promise<unknown>;
    };
    progress: ApplicationPorts["progress"];
    study: ApplicationPorts["study"];
    scheduler: ApplicationPorts["scheduler"];
}

export function createApplication(ports: ApplicationPorts): ApplicationServices {
    return {
        catalog: { get: (filters) => ports.content.getCatalog(filters) },
        courses: {
            get: (slug) => ports.content.getCourse(slug),
            enroll: (contentKey, data) => ports.progress.enrollCourse(contentKey, data),
        },
        lessons: {
            get: (key) => ports.content.getLesson(key),
            saveProgress: (contentKey, data) => ports.progress.saveLessonProgress(contentKey, data),
            bookmark: (contentKey, data) => ports.progress.saveBookmark(contentKey, data),
        },
        exercises: {
            get: (key) => ports.content.getQuestion(key),
            recordAttempt: (attempt) => ports.progress.recordAttempt(attempt),
        },
        maps: { get: (mapKey) => ports.content.getTopicMap(mapKey) },
        studyPlans: {
            get: (slug) => ports.content.getStudyPlan(slug),
            saveProgress: (contentKey, data) => ports.progress.savePlanProgress(contentKey, data),
        },
        progress: ports.progress,
        study: ports.study,
        scheduler: ports.scheduler,
    };
}
