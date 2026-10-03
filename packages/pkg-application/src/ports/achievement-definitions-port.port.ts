export interface AchievementDefinitionsPort {
  execute(stats?: Record<string, number>): Array<Record<string, unknown>>;
}
