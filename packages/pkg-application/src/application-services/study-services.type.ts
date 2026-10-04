import type { AddStudyPointsCommandHandler } from "../commands/add-study-points.command-handler";
import type { RecordStudyActivityCommandHandler } from "../commands/record-study-activity.command-handler";
import type { SyncAchievementsCommandHandler } from "../commands/sync-achievements.command-handler";
import type { AchievementDefinitionsQueryHandler } from "../queries/achievement-definitions.query-handler";
import type { ActionForDiagnosisQueryHandler } from "../queries/action-for-diagnosis.query-handler";
import type { CalculateTopicMasteryQueryHandler } from "../queries/calculate-topic-mastery.query-handler";
import type { RecommendNextQueryHandler } from "../queries/recommend-next.query-handler";
import type { SuggestDiagnosisQueryHandler } from "../queries/suggest-diagnosis.query-handler";

export type StudyServices = {
  recordStudyActivity: RecordStudyActivityCommandHandler;
  calculateTopicMastery: CalculateTopicMasteryQueryHandler;
  suggestDiagnosis: SuggestDiagnosisQueryHandler;
  actionForDiagnosis: ActionForDiagnosisQueryHandler;
  recommendNext: RecommendNextQueryHandler;
  achievementDefinitions: AchievementDefinitionsQueryHandler;
  syncAchievements: SyncAchievementsCommandHandler;
  addStudyPoints: AddStudyPointsCommandHandler;
};
