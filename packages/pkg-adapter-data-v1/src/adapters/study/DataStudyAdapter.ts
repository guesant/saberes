import type { ReviewTarget, StudyPort } from "@guesant/saberes-application";
import type { FsrsRating, PedagogicalAction } from "@guesant/saberes-domain";
import {
    achievementDefinitions,
    actionForDiagnosis,
    addStudyPoints,
    calculateTopicMastery,
    previewReview,
    recommendNext,
    recordStudyActivity,
    scheduleReview,
    suggestDiagnosis,
    syncAchievements,
} from "../../study/services";

export class DataStudyAdapter implements StudyPort {
    recordStudyActivity = recordStudyActivity;
    calculateTopicMastery = calculateTopicMastery;
    suggestDiagnosis = suggestDiagnosis;
    actionForDiagnosis(code: string): PedagogicalAction {
        return actionForDiagnosis(code as never);
    }
    recommendNext = recommendNext;
    scheduleReview(target: ReviewTarget, rating: FsrsRating, now = new Date()) {
        return scheduleReview(target as never, rating, now) as ReviewTarget;
    }
    previewReview(target: ReviewTarget, now = new Date()) {
        return previewReview(target as never, now);
    }
    achievementDefinitions = achievementDefinitions;
    syncAchievements = syncAchievements;
    addStudyPoints = addStudyPoints;
}
