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
