import Dexie, { type Table } from "dexie";
import {
    ReviewState as ReviewStateEnum,
    ReviewTargetType as ReviewTargetTypeEnum,
} from "@guesant/saberes-domain";
import type {
    DiagnosisCode,
    DiagnosisConfidence,
    DiagnosisSource,
    PedagogicalAction,
    ReviewState,
    ReviewTargetType,
} from "@guesant/saberes-domain";
import {
    type BaseIssue,
    type BaseSchema,
    boolean,
    nullable,
    object,
    optional,
    pipe,
    regex,
    safeParse,
    string,
} from "valibot";

export type ContentKey =
    | `course:${string}`
    | `lesson:${string}`
    | `topic:${string}`
    | `question:${string}`
    | `plan:${string}`
    | `assessment:${string}`
    | `achievement:${string}`
    | `daily:${string}`;

export type {
    DiagnosisCode,
    DiagnosisConfidence,
    DiagnosisSource,
    PedagogicalAction,
    ReviewState,
    ReviewTargetType,
} from "@guesant/saberes-domain";

export interface Attempt {
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

export interface ReviewTarget {
    contentKey: ContentKey | string;
    targetType?: ReviewTargetType;
    dueAt?: string;
    state?: ReviewState;
    difficulty?: number;
    stability?: number;
    retrievability?: number;
    lastReviewedAt?: string;
    suspended?: boolean;
    desiredRetention?: number;
    schedulerVersion?: string;
    updatedAt?: string;
}

export interface AttemptDiagnosis {
    attemptId: string;
    code: DiagnosisCode;
    confidence?: DiagnosisConfidence;
    suggestedBy?: DiagnosisSource;
    action?: PedagogicalAction;
    createdAt?: string;
}

const ContentKeySchema = pipe(
    string(),
    regex(/^(course|lesson|topic|question|plan|assessment|achievement|daily):/),
);
const AttemptSchema = object({
    id: optional(string()),
    contentKey: optional(ContentKeySchema),
    isCorrect: optional(nullable(boolean())),
    answeredAt: optional(string()),
});

function nowIso() {
    return new Date().toISOString();
}

function generatedId() {
    return (
        globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`
    );
}

function validated<T extends object>(schema: BaseSchema<unknown, T, BaseIssue<unknown>>, value: T) {
    const result = safeParse(schema, value);
    return result.success ? result.output : value;
}

class ProgressDatabase extends Dexie {
    attempts!: Table<Attempt & { id: string }>;
    sessions!: Table<{ id: string }, string>;
    settings!: Table<{ key: string; value: unknown }, string>;
    diagnoses!: Table<AttemptDiagnosis, string>;
    reviewTargets!: Table<ReviewTarget, string>;
    reviewEvents!: Table<
        { id: string; contentKey: string; rating: string; reviewedAt: string },
        string
    >;

    constructor() {
        super("saberes-progress");
        this.version(4)
            .stores({
                attempts: "id, answeredAt, sessionId, contentKey",
                sessions: "id, startedAt, completedAt",
                settings: "key",
                enrollments: "contentKey, startedAt",
                lessonProgress: "contentKey, completed, updatedAt",
                courseProgress: "contentKey, completed, updatedAt",
                moduleProgress: "contentKey, completed, updatedAt",
                planProgress: "contentKey, completed, updatedAt",
                bookmarks: "contentKey, updatedAt",
                reviewItems: "contentKey, dueAt, updatedAt",
                reviewTargets: "contentKey, dueAt, targetType, suspended, updatedAt",
                reviewEvents: "id, contentKey, reviewedAt",
                diagnoses: "attemptId, code, createdAt",
                dailyChallenges: "contentKey, date",
                studyGoals: "contentKey, dueDate",
                streaks: "contentKey, lastDate",
                achievements: "contentKey, unlockedAt",
                goals: "contentKey, updatedAt",
                topicMastery: "contentKey, percentage, updatedAt",
            })
            .upgrade(async (tx) => {
                const legacyItems = await tx.table("reviewItems").toArray();
                for (const item of legacyItems) {
                    await tx.table("reviewTargets").put({
                        ...item,
                        contentKey: item.contentKey,
                        targetType: item.targetType || ReviewTargetTypeEnum.Question,
                        state: item.state || ReviewStateEnum.New,
                        schedulerVersion: item.schedulerVersion || "legacy",
                        updatedAt: item.updatedAt || nowIso(),
                    });
                }
            });
    }
}

export const progressDb = new ProgressDatabase();

export async function saveAttempt(attempt: Attempt) {
    const normalized = validated(AttemptSchema, {
        ...attempt,
        id: attempt.id || generatedId(),
        answeredAt: attempt.answeredAt || nowIso(),
    }) as Attempt & { id: string };
    await progressDb.table("attempts").put(normalized);
    return normalized;
}

export function listAttempts() {
    return progressDb.table("attempts").toArray() as Promise<Array<Attempt & { id: string }>>;
}

export function saveSession(session: Record<string, unknown> & { id: string }) {
    return progressDb.table("sessions").put(session);
}

export function getSession(id: string) {
    return progressDb.table("sessions").get(id);
}

export function saveSetting(key: string, value: unknown) {
    return progressDb.table("settings").put({ key, value });
}

export function getSetting(key: string) {
    return progressDb.table("settings").get(key);
}

const studyStores = [
    "enrollments",
    "courseProgress",
    "moduleProgress",
    "lessonProgress",
    "planProgress",
    "bookmarks",
    "reviewItems",
    "reviewTargets",
    "reviewEvents",
    "diagnoses",
    "dailyChallenges",
    "studyGoals",
    "streaks",
    "achievements",
    "goals",
    "topicMastery",
];

export async function clearProgress() {
    await Promise.all(
        [...studyStores, "attempts", "sessions"].map((store) => progressDb.table(store).clear()),
    );
}

async function putStudy(store: string, contentKey: string, data: Record<string, unknown> = {}) {
    const value = { ...data, contentKey, updatedAt: nowIso() };
    await progressDb.table(store).put(value);
    return value;
}

function listStudy(store: string) {
    return progressDb.table(store).toArray();
}

export async function enrollCourse(contentKey: string, data: Record<string, unknown> = {}) {
    return putStudy("enrollments", contentKey, {
        ...data,
        startedAt: data.startedAt || nowIso(),
    });
}
export function listEnrollments() {
    return listStudy("enrollments");
}
export function saveLessonProgress(contentKey: string, data: Record<string, unknown> = {}) {
    return putStudy("lessonProgress", contentKey, data);
}
export function listLessonProgress() {
    return listStudy("lessonProgress");
}
export function saveCourseProgress(contentKey: string, data: Record<string, unknown> = {}) {
    return putStudy("courseProgress", contentKey, data);
}
export function listCourseProgress() {
    return listStudy("courseProgress");
}
export function saveModuleProgress(contentKey: string, data: Record<string, unknown> = {}) {
    return putStudy("moduleProgress", contentKey, data);
}
export function listModuleProgress() {
    return listStudy("moduleProgress");
}
export function savePlanProgress(contentKey: string, data: Record<string, unknown> = {}) {
    return putStudy("planProgress", contentKey, data);
}
export function listPlanProgress() {
    return listStudy("planProgress");
}
export function saveBookmark(contentKey: string, data: Record<string, unknown> = {}) {
    return putStudy("bookmarks", contentKey, data);
}
export function listBookmarks() {
    return listStudy("bookmarks");
}

export async function saveReviewItem(contentKey: string, data: Record<string, unknown> = {}) {
    const value = await putStudy("reviewItems", contentKey, data);
    await putStudy("reviewTargets", contentKey, {
        ...data,
        targetType: data.targetType || ReviewTargetTypeEnum.Question,
        state: data.state || ReviewStateEnum.New,
    });
    return value;
}

export function saveReviewTarget(contentKey: string, data: Partial<ReviewTarget> = {}) {
    return putStudy("reviewTargets", contentKey, data);
}
export function listReviewItems() {
    return listStudy("reviewItems");
}
export function listReviewTargets() {
    return listStudy("reviewTargets");
}
export function saveReviewEvent(event: Omit<ReviewDatabaseEvent, "id"> & { id?: string }) {
    return progressDb.table("reviewEvents").put({ ...event, id: event.id || generatedId() });
}
export function listReviewEvents(contentKey?: string) {
    return contentKey
        ? progressDb.table("reviewEvents").where("contentKey").equals(contentKey).toArray()
        : progressDb.table("reviewEvents").toArray();
}

interface ReviewDatabaseEvent {
    id: string;
    contentKey: string;
    rating: string;
    reviewedAt: string;
    diagnosis?: DiagnosisCode;
    elapsedMs?: number;
}

export function saveDiagnosis(diagnosis: AttemptDiagnosis) {
    return progressDb
        .table("diagnoses")
        .put({ ...diagnosis, createdAt: diagnosis.createdAt || nowIso() });
}
export function listDiagnoses() {
    return progressDb.table("diagnoses").toArray();
}
export function saveDailyChallenge(contentKey: string, data: Record<string, unknown> = {}) {
    return putStudy("dailyChallenges", contentKey, data);
}
export function listDailyChallenges() {
    return listStudy("dailyChallenges");
}
export function saveStudyGoal(contentKey: string, data: Record<string, unknown> = {}) {
    return putStudy("studyGoals", contentKey, data);
}
export function listStudyGoals() {
    return listStudy("studyGoals");
}
export function saveStreak(data: Record<string, unknown> = {}) {
    return putStudy("streaks", "current", data);
}
export function getStreak() {
    return progressDb.table("streaks").get("current");
}
export function saveAchievement(contentKey: string, data: Record<string, unknown> = {}) {
    return putStudy("achievements", contentKey, data);
}
export function listAchievements() {
    return listStudy("achievements");
}
export function saveTopicMastery(contentKey: string, data: Record<string, unknown> = {}) {
    return putStudy("topicMastery", contentKey, data);
}
export function listTopicMastery() {
    return listStudy("topicMastery");
}
