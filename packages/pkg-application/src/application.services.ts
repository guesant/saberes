import { AddStudyPointsCommandHandler } from "./commands/add-study-points.command-handler";
import { ClearProgressCommandHandler } from "./commands/clear-progress.command-handler";
import { EnrollCourseCommandHandler } from "./commands/enroll-course.command-handler";
import { ImportProgressCommandHandler } from "./commands/import-progress.command-handler";
import { RecordAttemptCommandHandler } from "./commands/record-attempt.command-handler";
import { RecordStudyActivityCommandHandler } from "./commands/record-study-activity.command-handler";
import { SaveAchievementCommandHandler } from "./commands/save-achievement.command-handler";
import { SaveAttemptCommandHandler } from "./commands/save-attempt.command-handler";
import { SaveBookmarkCommandHandler } from "./commands/save-bookmark.command-handler";
import { SaveDailyChallengeCommandHandler } from "./commands/save-daily-challenge.command-handler";
import { SaveDiagnosisCommandHandler } from "./commands/save-diagnosis.command-handler";
import { SaveLessonProgressCommandHandler } from "./commands/save-lesson-progress.command-handler";
import { SavePlanProgressCommandHandler } from "./commands/save-plan-progress.command-handler";
import { SaveReviewItemCommandHandler } from "./commands/save-review-item.command-handler";
import { SaveReviewTargetCommandHandler } from "./commands/save-review-target.command-handler";
import { SaveSessionCommandHandler } from "./commands/save-session.command-handler";
import { SaveSettingCommandHandler } from "./commands/save-setting.command-handler";
import { SaveStreakCommandHandler } from "./commands/save-streak.command-handler";
import { SaveTopicMasteryCommandHandler } from "./commands/save-topic-mastery.command-handler";
import { ScheduleReviewCommandHandler } from "./commands/schedule-review.command-handler";
import { SyncAchievementsCommandHandler } from "./commands/sync-achievements.command-handler";
import { AchievementDefinitionsQueryHandler } from "./queries/achievement-definitions.query-handler";
import { ActionForDiagnosisQueryHandler } from "./queries/action-for-diagnosis.query-handler";
import { BuildKnowledgeGraphQueryHandler } from "./queries/build-knowledge-graph.query-handler";
import { CalculateTopicMasteryQueryHandler } from "./queries/calculate-topic-mastery.query-handler";
import { ExportProgressQueryHandler } from "./queries/export-progress.query-handler";
import { GetAssessmentQueryHandler } from "./queries/get-assessment.query-handler";
import { GetCatalogQueryHandler } from "./queries/get-catalog.query-handler";
import { GetCourseQueryHandler } from "./queries/get-course.query-handler";
import { GetLessonQueryHandler } from "./queries/get-lesson.query-handler";
import { GetQuestionQueryHandler } from "./queries/get-question.query-handler";
import { GetSessionQueryHandler } from "./queries/get-session.query-handler";
import { GetSettingQueryHandler } from "./queries/get-setting.query-handler";
import { GetStreakQueryHandler } from "./queries/get-streak.query-handler";
import { GetStudyPlanQueryHandler } from "./queries/get-study-plan.query-handler";
import { GetTopicMapQueryHandler } from "./queries/get-topic-map.query-handler";
import { GetTopicQueryHandler } from "./queries/get-topic.query-handler";
import { ListAchievementsQueryHandler } from "./queries/list-achievements.query-handler";
import { ListAttemptsQueryHandler } from "./queries/list-attempts.query-handler";
import { ListBookmarksQueryHandler } from "./queries/list-bookmarks.query-handler";
import { ListDailyChallengesQueryHandler } from "./queries/list-daily-challenges.query-handler";
import { ListDiagnosesQueryHandler } from "./queries/list-diagnoses.query-handler";
import { ListEnrollmentsQueryHandler } from "./queries/list-enrollments.query-handler";
import { ListLessonProgressQueryHandler } from "./queries/list-lesson-progress.query-handler";
import { ListPlanProgressQueryHandler } from "./queries/list-plan-progress.query-handler";
import { ListReviewItemsQueryHandler } from "./queries/list-review-items.query-handler";
import { ListReviewTargetsQueryHandler } from "./queries/list-review-targets.query-handler";
import { ListTopicMasteryQueryHandler } from "./queries/list-topic-mastery.query-handler";
import { ParseEditorialBlocksQueryHandler } from "./queries/parse-editorial-blocks.query-handler";
import { PreviewReviewQueryHandler } from "./queries/preview-review.query-handler";
import { RecommendNextQueryHandler } from "./queries/recommend-next.query-handler";
import { SuggestDiagnosisQueryHandler } from "./queries/suggest-diagnosis.query-handler";
import type { ApplicationPorts } from "./application.ports";
import type { IdPort } from "./ports/id-port.port";

export interface ApplicationServices {
  platform: {
    ids: IdPort;
  };
  catalog: {
    get: GetCatalogQueryHandler;
  };
  courses: {
    get: GetCourseQueryHandler;
    enroll: EnrollCourseCommandHandler;
  };
  lessons: {
    get: GetLessonQueryHandler;
    saveProgress: SaveLessonProgressCommandHandler;
    bookmark: SaveBookmarkCommandHandler;
  };
  exercises: {
    get: GetQuestionQueryHandler;
    recordAttempt: RecordAttemptCommandHandler;
  };
  assessments: {
    get: GetAssessmentQueryHandler;
  };
  maps: {
    get: GetTopicMapQueryHandler;
    buildGraph: BuildKnowledgeGraphQueryHandler;
  };
  topics: {
    get: GetTopicQueryHandler;
  };
  editorial: {
    parseBlocks: ParseEditorialBlocksQueryHandler;
  };
  studyPlans: {
    get: GetStudyPlanQueryHandler;
    saveProgress: SavePlanProgressCommandHandler;
  };
  progress: {
    listAttempts: ListAttemptsQueryHandler;
    recordAttempt: RecordAttemptCommandHandler;
    saveAttempt: SaveAttemptCommandHandler;
    saveSession: SaveSessionCommandHandler;
    getSession: GetSessionQueryHandler;
    saveSetting: SaveSettingCommandHandler;
    getSetting: GetSettingQueryHandler;
    clearProgress: ClearProgressCommandHandler;
    enrollCourse: EnrollCourseCommandHandler;
    exportProgress: ExportProgressQueryHandler;
    importProgress: ImportProgressCommandHandler;
    listEnrollments: ListEnrollmentsQueryHandler;
    saveLessonProgress: SaveLessonProgressCommandHandler;
    listLessonProgress: ListLessonProgressQueryHandler;
    savePlanProgress: SavePlanProgressCommandHandler;
    listPlanProgress: ListPlanProgressQueryHandler;
    saveBookmark: SaveBookmarkCommandHandler;
    listBookmarks: ListBookmarksQueryHandler;
    saveReviewItem: SaveReviewItemCommandHandler;
    listReviewItems: ListReviewItemsQueryHandler;
    saveReviewTarget: SaveReviewTargetCommandHandler;
    listReviewTargets: ListReviewTargetsQueryHandler;
    saveDiagnosis: SaveDiagnosisCommandHandler;
    listDiagnoses: ListDiagnosesQueryHandler;
    saveDailyChallenge: SaveDailyChallengeCommandHandler;
    listDailyChallenges: ListDailyChallengesQueryHandler;
    saveStreak: SaveStreakCommandHandler;
    saveTopicMastery: SaveTopicMasteryCommandHandler;
    getStreak: GetStreakQueryHandler;
    saveAchievement: SaveAchievementCommandHandler;
    listAchievements: ListAchievementsQueryHandler;
    listTopicMastery: ListTopicMasteryQueryHandler;
  };
  study: {
    recordStudyActivity: RecordStudyActivityCommandHandler;
    calculateTopicMastery: CalculateTopicMasteryQueryHandler;
    suggestDiagnosis: SuggestDiagnosisQueryHandler;
    actionForDiagnosis: ActionForDiagnosisQueryHandler;
    recommendNext: RecommendNextQueryHandler;
    achievementDefinitions: AchievementDefinitionsQueryHandler;
    syncAchievements: SyncAchievementsCommandHandler;
    addStudyPoints: AddStudyPointsCommandHandler;
  };
  scheduler: {
    schedule: ScheduleReviewCommandHandler;
    preview: PreviewReviewQueryHandler;
  };
}

export function createApplication(ports: ApplicationPorts): ApplicationServices {
  const getCatalog = new GetCatalogQueryHandler(ports.getCatalog);

  const getCourse = new GetCourseQueryHandler(ports.getCourse);

  const getLesson = new GetLessonQueryHandler(ports.getLesson);

  const getQuestion = new GetQuestionQueryHandler(ports.getQuestion);

  const getAssessment = new GetAssessmentQueryHandler(ports.getAssessment);

  const getTopicMap = new GetTopicMapQueryHandler(ports.getTopicMap);

  const getTopic = new GetTopicQueryHandler(ports.getTopic);

  const getStudyPlan = new GetStudyPlanQueryHandler(ports.getStudyPlan);

  const listAttempts = new ListAttemptsQueryHandler(ports.listAttempts);

  const recordAttempt = new RecordAttemptCommandHandler(ports.recordAttempt);

  const saveAttempt = new SaveAttemptCommandHandler(ports.saveAttempt);

  const saveSession = new SaveSessionCommandHandler(ports.saveSession);

  const getSession = new GetSessionQueryHandler(ports.getSession);

  const saveSetting = new SaveSettingCommandHandler(ports.saveSetting);

  const getSetting = new GetSettingQueryHandler(ports.getSetting);

  const clearProgress = new ClearProgressCommandHandler(ports.clearProgress);

  const enrollCourse = new EnrollCourseCommandHandler(ports.enrollCourse);

  const exportProgress = new ExportProgressQueryHandler(ports.exportProgress);

  const importProgress = new ImportProgressCommandHandler(ports.importProgress);

  const listEnrollments = new ListEnrollmentsQueryHandler(ports.listEnrollments);

  const saveLessonProgress = new SaveLessonProgressCommandHandler(ports.saveLessonProgress);

  const listLessonProgress = new ListLessonProgressQueryHandler(ports.listLessonProgress);

  const savePlanProgress = new SavePlanProgressCommandHandler(ports.savePlanProgress);

  const listPlanProgress = new ListPlanProgressQueryHandler(ports.listPlanProgress);

  const saveBookmark = new SaveBookmarkCommandHandler(ports.saveBookmark);

  const listBookmarks = new ListBookmarksQueryHandler(ports.listBookmarks);

  const saveReviewItem = new SaveReviewItemCommandHandler(ports.saveReviewItem);

  const listReviewItems = new ListReviewItemsQueryHandler(ports.listReviewItems);

  const saveReviewTarget = new SaveReviewTargetCommandHandler(ports.saveReviewTarget);

  const listReviewTargets = new ListReviewTargetsQueryHandler(ports.listReviewTargets);

  const saveDiagnosis = new SaveDiagnosisCommandHandler(ports.saveDiagnosis);

  const listDiagnoses = new ListDiagnosesQueryHandler(ports.listDiagnoses);

  const saveDailyChallenge = new SaveDailyChallengeCommandHandler(ports.saveDailyChallenge);

  const listDailyChallenges = new ListDailyChallengesQueryHandler(ports.listDailyChallenges);

  const saveStreak = new SaveStreakCommandHandler(ports.saveStreak);

  const saveTopicMastery = new SaveTopicMasteryCommandHandler(ports.saveTopicMastery);

  const getStreak = new GetStreakQueryHandler(ports.getStreak);

  const saveAchievement = new SaveAchievementCommandHandler(ports.saveAchievement);

  const listAchievements = new ListAchievementsQueryHandler(ports.listAchievements);

  const listTopicMastery = new ListTopicMasteryQueryHandler(ports.listTopicMastery);

  const recordStudyActivity = new RecordStudyActivityCommandHandler(ports.recordStudyActivity);

  const calculateTopicMastery = new CalculateTopicMasteryQueryHandler(ports.calculateTopicMastery);

  const suggestDiagnosis = new SuggestDiagnosisQueryHandler(ports.suggestDiagnosis);

  const actionForDiagnosis = new ActionForDiagnosisQueryHandler(ports.actionForDiagnosis);

  const recommendNext = new RecommendNextQueryHandler(ports.recommendNext);

  const achievementDefinitions = new AchievementDefinitionsQueryHandler(
    ports.achievementDefinitions,
  );

  const syncAchievements = new SyncAchievementsCommandHandler(ports.syncAchievements);

  const addStudyPoints = new AddStudyPointsCommandHandler(ports.addStudyPoints);

  const scheduleReview = new ScheduleReviewCommandHandler(ports.scheduleReview);

  const previewReview = new PreviewReviewQueryHandler(ports.previewReview);

  const parseEditorialBlocks = new ParseEditorialBlocksQueryHandler(ports.parseEditorialBlocks);

  const buildKnowledgeGraph = new BuildKnowledgeGraphQueryHandler(ports.buildKnowledgeGraph);

  return {
    platform: { ids: ports.ids },
    catalog: { get: getCatalog },
    courses: { get: getCourse, enroll: enrollCourse },
    lessons: { get: getLesson, saveProgress: saveLessonProgress, bookmark: saveBookmark },
    exercises: { get: getQuestion, recordAttempt },
    assessments: { get: getAssessment },
    maps: { get: getTopicMap, buildGraph: buildKnowledgeGraph },
    topics: { get: getTopic },
    editorial: { parseBlocks: parseEditorialBlocks },
    studyPlans: { get: getStudyPlan, saveProgress: savePlanProgress },
    progress: {
      listAttempts,
      recordAttempt,
      saveAttempt,
      saveSession,
      getSession,
      saveSetting,
      getSetting,
      clearProgress,
      enrollCourse,
      exportProgress,
      importProgress,
      listEnrollments,
      saveLessonProgress,
      listLessonProgress,
      savePlanProgress,
      listPlanProgress,
      saveBookmark,
      listBookmarks,
      saveReviewItem,
      listReviewItems,
      saveReviewTarget,
      listReviewTargets,
      saveDiagnosis,
      listDiagnoses,
      saveDailyChallenge,
      listDailyChallenges,
      saveStreak,
      saveTopicMastery,
      getStreak,
      saveAchievement,
      listAchievements,
      listTopicMastery,
    },
    study: {
      recordStudyActivity,
      calculateTopicMastery,
      suggestDiagnosis,
      actionForDiagnosis,
      recommendNext,
      achievementDefinitions,
      syncAchievements,
      addStudyPoints,
    },
    scheduler: { schedule: scheduleReview, preview: previewReview },
  };
}
