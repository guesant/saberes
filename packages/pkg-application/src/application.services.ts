import { AddStudyPointsCommandHandler } from "./commands/add-study-points.command-handler";
import { ArchiveStudyCaptureCommandHandler } from "./commands/archive-study-capture.command-handler";
import { ClassifyStudyCaptureCommandHandler } from "./commands/classify-study-capture.command-handler";
import { ClearProgressCommandHandler } from "./commands/clear-progress.command-handler";
import { CompleteStudyCaptureCommandHandler } from "./commands/complete-study-capture.command-handler";
import { CreateCalendarEntryCommandHandler } from "./commands/create-calendar-entry.command-handler";
import { DeleteAcademicDisciplineCommandHandler } from "./commands/delete-academic-discipline.command-handler";
import { DeleteSavedCatalogFilterCommandHandler } from "./commands/delete-saved-catalog-filter.command-handler";
import { EnrollCourseCommandHandler } from "./commands/enroll-course.command-handler";
import { ImportProgressCommandHandler } from "./commands/import-progress.command-handler";
import { PostponeStudyCaptureCommandHandler } from "./commands/postpone-study-capture.command-handler";
import { RecordAttemptCommandHandler } from "./commands/record-attempt.command-handler";
import { RecordStudyActivityCommandHandler } from "./commands/record-study-activity.command-handler";
import { RestoreStudyCaptureCommandHandler } from "./commands/restore-study-capture.command-handler";
import { SaveAcademicDisciplineCommandHandler } from "./commands/save-academic-discipline.command-handler";
import { SaveAchievementCommandHandler } from "./commands/save-achievement.command-handler";
import { SaveAttemptCommandHandler } from "./commands/save-attempt.command-handler";
import { SaveBookmarkCommandHandler } from "./commands/save-bookmark.command-handler";
import { SaveDailyChallengeCommandHandler } from "./commands/save-daily-challenge.command-handler";
import { SaveDiagnosisCommandHandler } from "./commands/save-diagnosis.command-handler";
import { SaveFocusSessionCommandHandler } from "./commands/save-focus-session.command-handler";
import { SaveLessonProgressCommandHandler } from "./commands/save-lesson-progress.command-handler";
import { SavePersonalWorkspaceCommandHandler } from "./commands/save-personal-workspace.command-handler";
import { SavePlanProgressCommandHandler } from "./commands/save-plan-progress.command-handler";
import { SaveReviewItemCommandHandler } from "./commands/save-review-item.command-handler";
import { SaveReviewTargetCommandHandler } from "./commands/save-review-target.command-handler";
import { SaveSavedCatalogFilterCommandHandler } from "./commands/save-saved-catalog-filter.command-handler";
import { SaveSessionCommandHandler } from "./commands/save-session.command-handler";
import { SaveSettingCommandHandler } from "./commands/save-setting.command-handler";
import { SaveStreakCommandHandler } from "./commands/save-streak.command-handler";
import { SaveStudyGoalCommandHandler } from "./commands/save-study-goal.command-handler";
import { SaveTopicMasteryCommandHandler } from "./commands/save-topic-mastery.command-handler";
import { ScheduleReviewCommandHandler } from "./commands/schedule-review.command-handler";
import { SyncAchievementsCommandHandler } from "./commands/sync-achievements.command-handler";
import { UndoStudyCaptureCommandHandler } from "./commands/undo-study-capture.command-handler";
import { AchievementDefinitionsQueryHandler } from "./queries/achievement-definitions.query-handler";
import { ActionForDiagnosisQueryHandler } from "./queries/action-for-diagnosis.query-handler";
import { BuildKnowledgeGraphQueryHandler } from "./queries/build-knowledge-graph.query-handler";
import { CalculateAcademicMetricsQueryHandler } from "./queries/calculate-academic-metrics.query-handler";
import { CalculateTopicMasteryQueryHandler } from "./queries/calculate-topic-mastery.query-handler";
import { ExportProgressQueryHandler } from "./queries/export-progress.query-handler";
import { GetAssessmentQueryHandler } from "./queries/get-assessment.query-handler";
import { GetCatalogQueryHandler } from "./queries/get-catalog.query-handler";
import { GetContentReleaseQueryHandler } from "./queries/get-content-release.query-handler";
import { GetCourseQueryHandler } from "./queries/get-course.query-handler";
import { GetLessonQueryHandler } from "./queries/get-lesson.query-handler";
import { GetPersonalWorkspaceQueryHandler } from "./queries/get-personal-workspace.query-handler";
import { GetQuestionQueryHandler } from "./queries/get-question.query-handler";
import { GetSessionQueryHandler } from "./queries/get-session.query-handler";
import { GetSettingQueryHandler } from "./queries/get-setting.query-handler";
import { GetStreakQueryHandler } from "./queries/get-streak.query-handler";
import { GetStudyPlanQueryHandler } from "./queries/get-study-plan.query-handler";
import { GetTopicMapQueryHandler } from "./queries/get-topic-map.query-handler";
import { GetTopicQueryHandler } from "./queries/get-topic.query-handler";
import { ListAcademicDisciplinesQueryHandler } from "./queries/list-academic-disciplines.query-handler";
import { ListAchievementsQueryHandler } from "./queries/list-achievements.query-handler";
import { ListAttemptsQueryHandler } from "./queries/list-attempts.query-handler";
import { ListBookmarksQueryHandler } from "./queries/list-bookmarks.query-handler";
import { ListCalendarEntriesQueryHandler } from "./queries/list-calendar-entries.query-handler";
import { ListDailyChallengesQueryHandler } from "./queries/list-daily-challenges.query-handler";
import { ListDiagnosesQueryHandler } from "./queries/list-diagnoses.query-handler";
import { ListEnrollmentsQueryHandler } from "./queries/list-enrollments.query-handler";
import { ListFocusSessionsQueryHandler } from "./queries/list-focus-sessions.query-handler";
import { ListLessonProgressQueryHandler } from "./queries/list-lesson-progress.query-handler";
import { ListPlanProgressQueryHandler } from "./queries/list-plan-progress.query-handler";
import { ListReviewItemsQueryHandler } from "./queries/list-review-items.query-handler";
import { ListReviewTargetsQueryHandler } from "./queries/list-review-targets.query-handler";
import { ListSavedCatalogFiltersQueryHandler } from "./queries/list-saved-catalog-filters.query-handler";
import { ListStudyGoalsQueryHandler } from "./queries/list-study-goals.query-handler";
import { ListStudySessionsQueryHandler } from "./queries/list-study-sessions.query-handler";
import { ListTopicMasteryQueryHandler } from "./queries/list-topic-mastery.query-handler";
import { ParseEditorialBlocksQueryHandler } from "./queries/parse-editorial-blocks.query-handler";
import { PreviewReviewQueryHandler } from "./queries/preview-review.query-handler";
import { RecommendNextQueryHandler } from "./queries/recommend-next.query-handler";
import { SuggestDiagnosisQueryHandler } from "./queries/suggest-diagnosis.query-handler";
import { ValidateContentSnapshotQueryHandler } from "./queries/validate-content-snapshot.query-handler";
import type { AcademicServices } from "./application-services/academic-services.type";
import type { AssessmentServices } from "./application-services/assessment-services.type";
import type { CatalogServices } from "./application-services/catalog-services.type";
import type { CourseServices } from "./application-services/course-services.type";
import type { EditorialServices } from "./application-services/editorial-services.type";
import type { ExerciseServices } from "./application-services/exercise-services.type";
import type { FocusServices } from "./application-services/focus-services.type";
import type { GoalsServices } from "./application-services/goals-services.type";
import type { LessonServices } from "./application-services/lesson-services.type";
import type { MapServices } from "./application-services/map-services.type";
import type { PersonalServices } from "./application-services/personal-services.type";
import type { PlanningServices } from "./application-services/planning-services.interface";
import type { PlatformServices } from "./application-services/platform-services.type";
import type { ProgressServices } from "./application-services/progress-services.type";
import type { SchedulerServices } from "./application-services/scheduler-services.type";
import type { StudyPlanServices } from "./application-services/study-plan-services.type";
import type { StudyServices } from "./application-services/study-services.type";
import type { TopicServices } from "./application-services/topic-services.type";
import type { ApplicationPorts } from "./application.ports";

export interface ApplicationServices {
  goals: GoalsServices;
  focus: FocusServices;
  academic: AcademicServices;
  platform: PlatformServices;
  catalog: CatalogServices;
  courses: CourseServices;
  lessons: LessonServices;
  personal: PersonalServices;
  exercises: ExerciseServices;
  assessments: AssessmentServices;
  maps: MapServices;
  topics: TopicServices;
  editorial: EditorialServices;
  studyPlans: StudyPlanServices;
  progress: ProgressServices;
  study: StudyServices;
  scheduler: SchedulerServices;
  planning: PlanningServices;
}

export function createApplication(ports: ApplicationPorts): ApplicationServices {
  const listStudyGoals = new ListStudyGoalsQueryHandler(ports.listStudyGoals);

  const saveStudyGoal = new SaveStudyGoalCommandHandler(ports.saveStudyGoal);

  const listFocusSessions = new ListFocusSessionsQueryHandler(ports.listFocusSessions);

  const saveFocusSession = new SaveFocusSessionCommandHandler(ports.saveFocusSession);

  const listAcademicDisciplines = new ListAcademicDisciplinesQueryHandler(
    ports.listAcademicDisciplines,
  );

  const saveAcademicDiscipline = new SaveAcademicDisciplineCommandHandler(
    ports.saveAcademicDiscipline,
  );

  const deleteAcademicDiscipline = new DeleteAcademicDisciplineCommandHandler(
    ports.deleteAcademicDiscipline,
  );

  const calculateAcademicMetrics = new CalculateAcademicMetricsQueryHandler(
    ports.calculateAcademicMetrics,
  );

  const getCatalog = new GetCatalogQueryHandler(ports.getCatalog);

  const getCourse = new GetCourseQueryHandler(ports.getCourse);

  const getLesson = new GetLessonQueryHandler(ports.getLesson);

  const getPersonalWorkspace = new GetPersonalWorkspaceQueryHandler(ports.getPersonalWorkspace);

  const getQuestion = new GetQuestionQueryHandler(ports.getQuestion);

  const getAssessment = new GetAssessmentQueryHandler(ports.getAssessment);

  const getContentRelease = new GetContentReleaseQueryHandler(ports.getContentRelease);

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

  const savePersonalWorkspace = new SavePersonalWorkspaceCommandHandler(
    ports.savePersonalWorkspace,
  );

  const classifyStudyCapture = new ClassifyStudyCaptureCommandHandler(
    ports.classifyStudyCapture,
  );

  const createCalendarEntry = new CreateCalendarEntryCommandHandler(
    ports.createCalendarEntry,
  );

  const listCalendarEntries = new ListCalendarEntriesQueryHandler(
    ports.listCalendarEntries,
  );

  const completeStudyCapture = new CompleteStudyCaptureCommandHandler(
    ports.completeStudyCapture,
  );

  const postponeStudyCapture = new PostponeStudyCaptureCommandHandler(
    ports.postponeStudyCapture,
  );

  const archiveStudyCapture = new ArchiveStudyCaptureCommandHandler(
    ports.archiveStudyCapture,
  );

  const restoreStudyCapture = new RestoreStudyCaptureCommandHandler(
    ports.restoreStudyCapture,
  );

  const undoStudyCapture = new UndoStudyCaptureCommandHandler(
    ports.undoStudyCapture,
  );

  const listPlanProgress = new ListPlanProgressQueryHandler(ports.listPlanProgress);

  const saveBookmark = new SaveBookmarkCommandHandler(ports.saveBookmark);

  const listBookmarks = new ListBookmarksQueryHandler(ports.listBookmarks);

  const saveReviewItem = new SaveReviewItemCommandHandler(ports.saveReviewItem);

  const listReviewItems = new ListReviewItemsQueryHandler(ports.listReviewItems);

  const saveReviewTarget = new SaveReviewTargetCommandHandler(ports.saveReviewTarget);

  const listReviewTargets = new ListReviewTargetsQueryHandler(ports.listReviewTargets);

  const listStudySessions = new ListStudySessionsQueryHandler(ports.listStudySessions);

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

  const listSavedCatalogFilters = new ListSavedCatalogFiltersQueryHandler(
    ports.listSavedCatalogFilters,
  );

  const saveSavedCatalogFilter = new SaveSavedCatalogFilterCommandHandler(
    ports.saveSavedCatalogFilter,
  );

  const deleteSavedCatalogFilter = new DeleteSavedCatalogFilterCommandHandler(
    ports.deleteSavedCatalogFilter,
  );

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

  const validateContentSnapshot = new ValidateContentSnapshotQueryHandler(
    ports.validateContentSnapshot,
  );

  const buildKnowledgeGraph = new BuildKnowledgeGraphQueryHandler(ports.buildKnowledgeGraph);

  return {
    goals: { list: listStudyGoals, save: saveStudyGoal },
    focus: { list: listFocusSessions, save: saveFocusSession },
    academic: {
      list: listAcademicDisciplines,
      save: saveAcademicDiscipline,
      delete: deleteAcademicDiscipline,
      calculateMetrics: calculateAcademicMetrics,
    },
    platform: { ids: ports.ids },
    catalog: { get: getCatalog },
    courses: { get: getCourse, enroll: enrollCourse },
    lessons: { get: getLesson, saveProgress: saveLessonProgress, bookmark: saveBookmark },
    personal: {
      classifyCapture: classifyStudyCapture,
      completeCapture: completeStudyCapture,
      postponeCapture: postponeStudyCapture,
      archiveCapture: archiveStudyCapture,
      restoreCapture: restoreStudyCapture,
      undoCapture: undoStudyCapture,
      get: getPersonalWorkspace,
      save: savePersonalWorkspace,
    },
    exercises: { get: getQuestion, recordAttempt },
    assessments: { get: getAssessment },
    maps: { get: getTopicMap, buildGraph: buildKnowledgeGraph },
    topics: { get: getTopic },
    editorial: {
      parseBlocks: parseEditorialBlocks,
      validateSnapshot: validateContentSnapshot,
      getRelease: getContentRelease,
    },
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
      listStudySessions,
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
      listSavedCatalogFilters,
      saveSavedCatalogFilter,
      deleteSavedCatalogFilter,
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
    planning: { createCalendarEntry, listCalendarEntries },
  };
}
