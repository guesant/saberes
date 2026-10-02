import { format, isSameDay, parseISO, subDays } from "date-fns";
import { type Card, createEmptyCard, fsrs, Rating } from "ts-fsrs";
import {
    DiagnosisCode as DiagnosisCodeEnum,
    FsrsRating,
    PedagogicalAction,
    ReviewState as ReviewStateEnum,
} from "@guesant/saberes-core";
import type { Attempt, DiagnosisCode, ReviewState, ReviewTarget } from "../storage/progress";

export { FsrsRating } from "@guesant/saberes-core";
import {
    getSetting,
    getStreak,
    saveAchievement,
    saveSetting,
    saveStreak,
} from "../storage/progress";

function dateKey(value: Date | string = new Date()) {
    return format(typeof value === "string" ? parseISO(value) : value, "yyyy-MM-dd");
}

export async function recordStudyActivity(activity: { at?: Date | string; type?: string } = {}) {
    const today = dateKey(activity.at || new Date());
    const previous = await getStreak();
    const previousDate = previous?.lastDate ? parseISO(previous.lastDate as string) : null;
    const continues = previousDate ? isSameDay(subDays(parseISO(today), 1), previousDate) : false;
    let current = 1;
    if (previous?.lastDate === today) current = Number(previous.current || 0);
    else if (continues) current = Number(previous?.current || 0) + 1;
    const next = {
        current,
        best: Math.max(Number(previous?.best || 0), current),
        lastDate: today,
        lastActivity: activity.type || "study",
    };
    await saveStreak(next);
    return next;
}

function diagnosticWeight(code?: DiagnosisCode) {
    if (code === DiagnosisCodeEnum.ConceptGap || code === DiagnosisCodeEnum.DidNotKnow) return 0.25;
    if (code === DiagnosisCodeEnum.Forgetting) return 0.45;
    if (
        code === DiagnosisCodeEnum.ProceduralGap ||
        code === DiagnosisCodeEnum.InterpretationGap ||
        code === DiagnosisCodeEnum.StrategyGap
    )
        return 0.55;
    if (code === DiagnosisCodeEnum.Inattention) return 0.8;
    if (code === DiagnosisCodeEnum.CorrectWithDoubt || code === DiagnosisCodeEnum.CorrectByGuess)
        return 0.7;
    return 1;
}

export function calculateTopicMastery(attempts: Attempt[] = []) {
    const map = new Map<
        string,
        {
            total: number;
            correct: number;
            weighted: number;
            lastAnsweredAt: string | null;
        }
    >();
    for (const attempt of attempts) {
        if (attempt.isCorrect === null || attempt.isCorrect === undefined) continue;
        for (const rawTopicId of attempt.topicIds || []) {
            const topicId = String(rawTopicId);
            const value = map.get(topicId) || {
                total: 0,
                correct: 0,
                weighted: 0,
                lastAnsweredAt: null,
            };
            const weight = diagnosticWeight(attempt.diagnosis);
            value.total += 1;
            value.correct += attempt.isCorrect ? 1 : 0;
            value.weighted += attempt.isCorrect ? weight : 0;
            value.lastAnsweredAt = attempt.answeredAt || value.lastAnsweredAt;
            map.set(topicId, value);
        }
    }
    return Object.fromEntries(
        [...map.entries()].map(([topicId, value]) => {
            const percentage = value.total ? Math.round((value.correct / value.total) * 100) : 0;
            const weightedPercentage = value.total
                ? Math.round((value.weighted / value.total) * 100)
                : 0;
            let confidence = "high";
            if (value.total < 3) confidence = "low";
            else if (value.total < 8) confidence = "medium";
            let learningState = "unseen";
            if (value.total) learningState = "practicing";
            if (percentage >= 80 && value.total >= 5) learningState = "mastered";
            return [
                topicId,
                {
                    ...value,
                    percentage,
                    weightedPercentage,
                    confidence,
                    learningState,
                },
            ];
        }),
    );
}

export function suggestDiagnosis(
    attempt: Pick<Attempt, "isCorrect" | "elapsedMs" | "attemptNumber">,
): DiagnosisCode {
    if (attempt.isCorrect) {
        if ((attempt.attemptNumber || 1) > 1) return DiagnosisCodeEnum.CorrectWithDoubt;
        if (Number(attempt.elapsedMs || 0) < 5000) return DiagnosisCodeEnum.CorrectByGuess;
        return DiagnosisCodeEnum.CorrectConfident;
    }
    if (Number(attempt.elapsedMs || 0) < 2500) return DiagnosisCodeEnum.Inattention;
    return DiagnosisCodeEnum.ConceptGap;
}

export function actionForDiagnosis(code: DiagnosisCode): PedagogicalAction {
    if (code === DiagnosisCodeEnum.ConceptGap || code === DiagnosisCodeEnum.DidNotKnow)
        return PedagogicalAction.Theory;
    if (code === DiagnosisCodeEnum.ProceduralGap) return PedagogicalAction.Practice;
    if (code === DiagnosisCodeEnum.InterpretationGap || code === DiagnosisCodeEnum.StrategyGap)
        return PedagogicalAction.Practice;
    if (
        code === DiagnosisCodeEnum.Forgetting ||
        code === DiagnosisCodeEnum.CorrectWithDoubt ||
        code === DiagnosisCodeEnum.CorrectByGuess
    )
        return PedagogicalAction.Review;
    if (code === DiagnosisCodeEnum.Inattention) return PedagogicalAction.Retry;
    return PedagogicalAction.None;
}

export function recommendNext({
    incompleteItems = [],
    prerequisites = [],
    topicMastery = {},
    recentErrors = [],
}: {
    incompleteItems?: Array<{ id: string | number; topicId?: string | number }>;
    prerequisites?: Array<{ topicId?: string | number; completed?: boolean }>;
    topicMastery?: Record<string, { percentage?: number }>;
    recentErrors?: Array<{ topicIds?: Array<string | number> }>;
} = {}) {
    const blocked = new Set(
        prerequisites.filter((item) => !item.completed).map((item) => String(item.topicId)),
    );
    const weakTopics = Object.entries(topicMastery)
        .sort(([, left], [, right]) => (left.percentage || 0) - (right.percentage || 0))
        .map(([topicId]) => String(topicId));
    const errorTopics = recentErrors.flatMap((item) => (item.topicIds || []).map(String));
    return (
        incompleteItems.find(
            (item) =>
                !blocked.has(String(item.topicId)) && errorTopics.includes(String(item.topicId)),
        ) ||
        incompleteItems.find(
            (item) =>
                !blocked.has(String(item.topicId)) && weakTopics.includes(String(item.topicId)),
        ) ||
        incompleteItems.find((item) => !blocked.has(String(item.topicId))) ||
        incompleteItems[0] ||
        null
    );
}

const scheduler = fsrs({ request_retention: 0.9, enable_fuzz: false });

type StoredCard = Omit<Card, "due" | "last_review"> & {
    due: string;
    last_review: string | null;
};

function serializeCard(card: Card): StoredCard {
    return {
        ...card,
        due: card.due.toISOString(),
        last_review: card.last_review?.toISOString() || null,
    };
}

function reviveCard(card?: StoredCard | null): Card {
    if (!card) return createEmptyCard(new Date());
    return {
        ...card,
        due: new Date(card.due),
        last_review: card.last_review ? new Date(card.last_review) : undefined,
    } as Card;
}

const ratings = {
    [FsrsRating.Again]: Rating.Again,
    [FsrsRating.Hard]: Rating.Hard,
    [FsrsRating.Good]: Rating.Good,
    [FsrsRating.Easy]: Rating.Easy,
} as const;

export function scheduleReview(
    target: ReviewTarget & { fsrsCard?: StoredCard },
    rating: FsrsRating,
    now = new Date(),
) {
    const result = scheduler.next(reviveCard(target.fsrsCard), now, ratings[rating]);
    let state: ReviewState = ReviewStateEnum.Relearning;
    if (result.card.state === 0) state = ReviewStateEnum.New;
    else if (result.card.state === 1) state = ReviewStateEnum.Learning;
    else if (result.card.state === 2) state = ReviewStateEnum.Review;
    return {
        ...target,
        fsrsCard: serializeCard(result.card),
        dueAt: result.card.due.toISOString(),
        difficulty: result.card.difficulty,
        stability: result.card.stability,
        retrievability: scheduler.get_retrievability(result.card, now, false),
        state,
        lastReviewedAt: now.toISOString(),
        schedulerVersion: "ts-fsrs-v6",
    } satisfies ReviewTarget & { fsrsCard: StoredCard };
}

export function previewReview(target: ReviewTarget & { fsrsCard?: StoredCard }, now = new Date()) {
    const result = scheduler.repeat(reviveCard(target.fsrsCard), now);
    return Object.fromEntries(
        (Object.values(FsrsRating) as FsrsRating[]).map((rating) => [
            rating,
            {
                dueAt: result[ratings[rating]].card.due.toISOString(),
                interval: result[ratings[rating]].card.due.getTime() - now.getTime(),
            },
        ]),
    );
}

export function achievementDefinitions(
    stats: {
        attempts?: number;
        correct?: number;
        lessons?: number;
        sessions?: number;
        streak?: number;
        courses?: number;
        reviews?: number;
    } = {},
) {
    const definitions = [
        {
            key: "first-question",
            title: "Primeira questão",
            description: "Responda sua primeira questão.",
            unlocked: (value: typeof stats) => (value.attempts || 0) >= 1,
        },
        {
            key: "first-lesson",
            title: "Primeira aula",
            description: "Conclua sua primeira aula.",
            unlocked: (value: typeof stats) => (value.lessons || 0) >= 1,
        },
        {
            key: "first-simulator",
            title: "Primeiro simulado",
            description: "Conclua seu primeiro simulado.",
            unlocked: (value: typeof stats) => (value.sessions || 0) >= 1,
        },
        {
            key: "ten-questions",
            title: "Ritmo de prática",
            description: "Responda 10 questões.",
            unlocked: (value: typeof stats) => (value.attempts || 0) >= 10,
        },
        {
            key: "ten-correct",
            title: "Base consistente",
            description: "Acerte 10 questões.",
            unlocked: (value: typeof stats) => (value.correct || 0) >= 10,
        },
        {
            key: "seven-day-streak",
            title: "Uma semana firme",
            description: "Estude por 7 dias consecutivos.",
            unlocked: (value: typeof stats) => (value.streak || 0) >= 7,
        },
        {
            key: "thirty-day-streak",
            title: "Constância",
            description: "Estude por 30 dias consecutivos.",
            unlocked: (value: typeof stats) => (value.streak || 0) >= 30,
        },
        {
            key: "first-course",
            title: "Trilha concluída",
            description: "Conclua seu primeiro curso.",
            unlocked: (value: typeof stats) => (value.courses || 0) >= 1,
        },
        {
            key: "review-ten",
            title: "Revisão ativa",
            description: "Revise 10 questões erradas.",
            unlocked: (value: typeof stats) => (value.reviews || 0) >= 10,
        },
    ];
    return definitions.map((definition) => ({
        ...definition,
        isUnlocked: definition.unlocked(stats),
    }));
}

export async function syncAchievements(stats: Parameters<typeof achievementDefinitions>[0] = {}) {
    const achievements = achievementDefinitions(stats);
    await Promise.all(
        achievements
            .filter((item) => item.isUnlocked)
            .map((item) =>
                saveAchievement(`achievement:${item.key}`, {
                    ...item,
                    unlockedAt: new Date().toISOString(),
                }),
            ),
    );
    return achievements;
}

export async function addStudyPoints(amount: number, reason: string) {
    const current = await getSetting("studyPoints");
    const points = Number(current?.value || 0) + Number(amount || 0);
    await saveSetting("studyPoints", points);
    return { points, reason };
}
