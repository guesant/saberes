import type { ProgressPort } from "@guesant/saberes-application";
import type { DiagnosisRecord } from "@guesant/saberes-domain";
import {
    type Attempt,
    type AttemptDiagnosis,
    type ReviewTarget,
    clearProgress,
    enrollCourse,
    getSession,
    getSetting,
    getStreak,
    listAchievements,
    listAttempts,
    listBookmarks,
    listDailyChallenges,
    listDiagnoses,
    listEnrollments,
    listLessonProgress,
    listPlanProgress,
    listReviewItems,
    listReviewTargets,
    listTopicMastery,
    saveAchievement,
    saveAttempt,
    saveBookmark,
    saveDailyChallenge,
    saveDiagnosis,
    saveLessonProgress,
    savePlanProgress,
    saveReviewItem,
    saveReviewTarget,
    saveSession,
    saveSetting,
    saveStreak,
} from "../../../storage/progress";

export class DexieProgressAdapter implements ProgressPort {
    async listAttempts() {
        return (await listAttempts()) as Attempt[];
    }
    async saveAttempt(attempt: Attempt) {
        return saveAttempt(attempt);
    }
    async recordAttempt(attempt: Attempt) {
        return saveAttempt(attempt);
    }
    async saveSession(session: { id: string; [key: string]: unknown }) {
        await saveSession(session);
    }
    getSession = getSession;
    async saveSetting(key: string, value: unknown) {
        await saveSetting(key, value);
    }
    getSetting = getSetting;
    clear = clearProgress;
    enrollCourse = enrollCourse;
    listEnrollments = listEnrollments;
    saveLessonProgress = saveLessonProgress;
    listLessonProgress = listLessonProgress;
    savePlanProgress = savePlanProgress;
    listPlanProgress = listPlanProgress;
    saveBookmark = saveBookmark;
    listBookmarks = listBookmarks;
    saveReviewItem = saveReviewItem;
    listReviewItems = listReviewItems;
    saveReviewTarget = saveReviewTarget;
    listReviewTargets = listReviewTargets;
    async saveDiagnosis(diagnosis: DiagnosisRecord) {
        await saveDiagnosis(diagnosis as AttemptDiagnosis);
    }
    listDiagnoses = listDiagnoses;
    saveDailyChallenge = saveDailyChallenge;
    listDailyChallenges = listDailyChallenges;
    saveStreak = saveStreak;
    getStreak = getStreak;
    saveAchievement = saveAchievement;
    listAchievements = listAchievements;
    listTopicMastery = listTopicMastery;
}

export type { Attempt, ReviewTarget };
