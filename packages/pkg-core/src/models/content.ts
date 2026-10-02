import type { CatalogCardType } from "./enums.ts";

export type ContentKey =
    | `course:${string}`
    | `lesson:${string}`
    | `topic:${string}`
    | `question:${string}`
    | `plan:${string}`
    | `assessment:${string}`;

export interface CatalogFilters {
    search?: string;
}

export interface CatalogCard {
    id: number | string;
    title: string;
    description?: string;
    type: CatalogCardType;
    slug?: string;
    href?: string;
    meta?: string;
    courseType?: string;
    topicCount?: number;
    stepCount?: number;
    moduleCount?: number;
    totalMinutes?: number;
    processName?: string;
    year?: number;
}

export interface CatalogReadModel {
    courses: CatalogCard[];
    maps: CatalogCard[];
    plans: CatalogCard[];
    content: CatalogCard[];
}

export interface CourseReadModel {
    course: Record<string, unknown>;
    modules: Array<Record<string, unknown>>;
    items: Array<Record<string, unknown>>;
}

export interface LessonReadModel {
    lesson: Record<string, unknown>;
    sections: Array<Record<string, unknown>>;
}

export interface QuestionReadModel {
    question: Record<string, unknown>;
    options: Array<Record<string, unknown>>;
    parts: Array<Record<string, unknown>>;
    topics: Array<Record<string, unknown>>;
    related: Array<Record<string, unknown>>;
}

export interface AssessmentReadModel {
    assessment: Record<string, unknown>;
    items: Array<Record<string, unknown>>;
}

export interface TopicMapReadModel {
    map: Record<string, unknown>;
    nodes: Array<Record<string, unknown>>;
    edges: Array<Record<string, unknown>>;
}

export interface StudyPlanReadModel {
    plan: Record<string, unknown> | null;
    steps: Array<Record<string, unknown>>;
}
