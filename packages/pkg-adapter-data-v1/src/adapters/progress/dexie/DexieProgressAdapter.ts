import type {
    AttemptRecord,
    DiagnosisRecord,
    LessonProgressRecord,
    PlanProgressRecord,
    ReviewTargetRecord,
} from "@guesant/saberes-core";
import type { ProgressPort } from "@guesant/saberes-core";
import {
    type Attempt,
    type AttemptDiagnosis,
    enrollCourse,
    listAttempts,
    listLessonProgress,
    listPlanProgress,
    listReviewTargets,
    type ReviewTarget,
    saveAttempt,
    saveBookmark,
    saveDiagnosis,
    saveLessonProgress,
    savePlanProgress,
    saveReviewTarget,
} from "../../../storage/progress";

export class DexieProgressAdapter implements ProgressPort {
    async listAttempts() {
        return (await listAttempts()) as AttemptRecord[];
    }

    async recordAttempt(attempt: AttemptRecord) {
        await saveAttempt(attempt as Attempt);
    }

    async enrollCourse(contentKey: string, data: Record<string, unknown> = {}) {
        await enrollCourse(contentKey, data);
    }

    async listLessonProgress() {
        return (await listLessonProgress()) as LessonProgressRecord[];
    }

    async saveLessonProgress(progress: LessonProgressRecord) {
        await saveLessonProgress(progress.contentKey, progress);
    }

    async saveBookmark(contentKey: string, data: Record<string, unknown> = {}) {
        await saveBookmark(contentKey, data);
    }

    async listPlanProgress() {
        return (await listPlanProgress()) as PlanProgressRecord[];
    }

    async savePlanProgress(progress: PlanProgressRecord) {
        await savePlanProgress(progress.contentKey, progress);
    }

    async listReviewTargets() {
        return (await listReviewTargets()) as ReviewTargetRecord[];
    }

    async saveReviewTarget(target: ReviewTargetRecord) {
        await saveReviewTarget(
            target.contentKey,
            target as Partial<ReviewTarget>,
        );
    }

    async saveDiagnosis(diagnosis: DiagnosisRecord) {
        await saveDiagnosis(diagnosis as AttemptDiagnosis);
    }
}
