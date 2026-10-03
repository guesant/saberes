import type { AchievementDefinitionsPort } from "./ports/achievement-definitions-port.port.ts";
import type { ActionForDiagnosisPort } from "./ports/action-for-diagnosis-port.port.ts";
import type { AddStudyPointsPort } from "./ports/add-study-points-port.port.ts";
import type { BuildKnowledgeGraphPort } from "./ports/build-knowledge-graph-port.port.ts";
import type { CalculateTopicMasteryPort } from "./ports/calculate-topic-mastery-port.port.ts";
import type { ClearProgressPort } from "./ports/clear-progress-port.port.ts";
import type { ClockPort } from "./ports/clock-port.port.ts";
import type { EnrollCoursePort } from "./ports/enroll-course-port.port.ts";
import type { GetAssessmentPort } from "./ports/get-assessment-port.port.ts";
import type { GetCatalogPort } from "./ports/get-catalog-port.port.ts";
import type { GetCoursePort } from "./ports/get-course-port.port.ts";
import type { GetLessonPort } from "./ports/get-lesson-port.port.ts";
import type { GetQuestionPort } from "./ports/get-question-port.port.ts";
import type { GetSessionPort } from "./ports/get-session-port.port.ts";
import type { GetSettingPort } from "./ports/get-setting-port.port.ts";
import type { GetStreakPort } from "./ports/get-streak-port.port.ts";
import type { GetStudyPlanPort } from "./ports/get-study-plan-port.port.ts";
import type { GetTopicMapPort } from "./ports/get-topic-map-port.port.ts";
import type { IdPort } from "./ports/id-port.port.ts";
import type { ListAchievementsPort } from "./ports/list-achievements-port.port.ts";
import type { ListAttemptsPort } from "./ports/list-attempts-port.port.ts";
import type { ListBookmarksPort } from "./ports/list-bookmarks-port.port.ts";
import type { ListDailyChallengesPort } from "./ports/list-daily-challenges-port.port.ts";
import type { ListDiagnosesPort } from "./ports/list-diagnoses-port.port.ts";
import type { ListEnrollmentsPort } from "./ports/list-enrollments-port.port.ts";
import type { ListLessonProgressPort } from "./ports/list-lesson-progress-port.port.ts";
import type { ListPlanProgressPort } from "./ports/list-plan-progress-port.port.ts";
import type { ListReviewItemsPort } from "./ports/list-review-items-port.port.ts";
import type { ListReviewTargetsPort } from "./ports/list-review-targets-port.port.ts";
import type { ListTopicMasteryPort } from "./ports/list-topic-mastery-port.port.ts";
import type { ParseEditorialBlocksPort } from "./ports/parse-editorial-blocks-port.port.ts";
import type { PreviewReviewPort } from "./ports/preview-review-port.port.ts";
import type { RecommendNextPort } from "./ports/recommend-next-port.port.ts";
import type { RecordAttemptPort } from "./ports/record-attempt-port.port.ts";
import type { RecordStudyActivityPort } from "./ports/record-study-activity-port.port.ts";
import type { SaveAchievementPort } from "./ports/save-achievement-port.port.ts";
import type { SaveAttemptPort } from "./ports/save-attempt-port.port.ts";
import type { SaveBookmarkPort } from "./ports/save-bookmark-port.port.ts";
import type { SaveDailyChallengePort } from "./ports/save-daily-challenge-port.port.ts";
import type { SaveDiagnosisPort } from "./ports/save-diagnosis-port.port.ts";
import type { SaveLessonProgressPort } from "./ports/save-lesson-progress-port.port.ts";
import type { SavePlanProgressPort } from "./ports/save-plan-progress-port.port.ts";
import type { SaveReviewItemPort } from "./ports/save-review-item-port.port.ts";
import type { SaveReviewTargetPort } from "./ports/save-review-target-port.port.ts";
import type { SaveSessionPort } from "./ports/save-session-port.port.ts";
import type { SaveSettingPort } from "./ports/save-setting-port.port.ts";
import type { SaveStreakPort } from "./ports/save-streak-port.port.ts";
import type { ScheduleReviewPort } from "./ports/schedule-review-port.port.ts";
import type { SuggestDiagnosisPort } from "./ports/suggest-diagnosis-port.port.ts";
import type { SyncAchievementsPort } from "./ports/sync-achievements-port.port.ts";

export {
  type AchievementDefinitionsPort,
  type ActionForDiagnosisPort,
  type AddStudyPointsPort,
  type BuildKnowledgeGraphPort,
  type CalculateTopicMasteryPort,
  type ClearProgressPort,
  type ClockPort,
  type EnrollCoursePort,
  type GetAssessmentPort,
  type GetCatalogPort,
  type GetCoursePort,
  type GetLessonPort,
  type GetQuestionPort,
  type GetSessionPort,
  type GetSettingPort,
  type GetStreakPort,
  type GetStudyPlanPort,
  type GetTopicMapPort,
  type IdPort,
  type ListAchievementsPort,
  type ListAttemptsPort,
  type ListBookmarksPort,
  type ListDailyChallengesPort,
  type ListDiagnosesPort,
  type ListEnrollmentsPort,
  type ListLessonProgressPort,
  type ListPlanProgressPort,
  type ListReviewItemsPort,
  type ListReviewTargetsPort,
  type ListTopicMasteryPort,
  type PreviewReviewPort,
  type ParseEditorialBlocksPort,
  type RecommendNextPort,
  type RecordAttemptPort,
  type RecordStudyActivityPort,
  type SaveAchievementPort,
  type SaveAttemptPort,
  type SaveBookmarkPort,
  type SaveDailyChallengePort,
  type SaveDiagnosisPort,
  type SaveLessonProgressPort,
  type SavePlanProgressPort,
  type SaveReviewItemPort,
  type SaveReviewTargetPort,
  type SaveSessionPort,
  type SaveSettingPort,
  type SaveStreakPort,
  type ScheduleReviewPort,
  type SuggestDiagnosisPort,
  type SyncAchievementsPort,
} from "./ports/index.ts";

export interface ApplicationPorts {
  getCatalog: GetCatalogPort;
  getCourse: GetCoursePort;
  getLesson: GetLessonPort;
  getQuestion: GetQuestionPort;
  getAssessment: GetAssessmentPort;
  getTopicMap: GetTopicMapPort;
  getStudyPlan: GetStudyPlanPort;
  listAttempts: ListAttemptsPort;
  recordAttempt: RecordAttemptPort;
  saveAttempt: SaveAttemptPort;
  saveSession: SaveSessionPort;
  getSession: GetSessionPort;
  saveSetting: SaveSettingPort;
  getSetting: GetSettingPort;
  clearProgress: ClearProgressPort;
  enrollCourse: EnrollCoursePort;
  listEnrollments: ListEnrollmentsPort;
  saveLessonProgress: SaveLessonProgressPort;
  listLessonProgress: ListLessonProgressPort;
  savePlanProgress: SavePlanProgressPort;
  listPlanProgress: ListPlanProgressPort;
  saveBookmark: SaveBookmarkPort;
  listBookmarks: ListBookmarksPort;
  saveReviewItem: SaveReviewItemPort;
  listReviewItems: ListReviewItemsPort;
  saveReviewTarget: SaveReviewTargetPort;
  listReviewTargets: ListReviewTargetsPort;
  saveDiagnosis: SaveDiagnosisPort;
  listDiagnoses: ListDiagnosesPort;
  saveDailyChallenge: SaveDailyChallengePort;
  listDailyChallenges: ListDailyChallengesPort;
  saveStreak: SaveStreakPort;
  getStreak: GetStreakPort;
  saveAchievement: SaveAchievementPort;
  listAchievements: ListAchievementsPort;
  listTopicMastery: ListTopicMasteryPort;
  scheduleReview: ScheduleReviewPort;
  previewReview: PreviewReviewPort;
  recordStudyActivity: RecordStudyActivityPort;
  calculateTopicMastery: CalculateTopicMasteryPort;
  suggestDiagnosis: SuggestDiagnosisPort;
  actionForDiagnosis: ActionForDiagnosisPort;
  recommendNext: RecommendNextPort;
  achievementDefinitions: AchievementDefinitionsPort;
  syncAchievements: SyncAchievementsPort;
  addStudyPoints: AddStudyPointsPort;
  clock: ClockPort;
  ids: IdPort;
  parseEditorialBlocks: ParseEditorialBlocksPort;
  buildKnowledgeGraph: BuildKnowledgeGraphPort;
}
