export interface SyncAchievementsPort {
  execute(stats?: Record<string, number>): Promise<Array<Record<string, unknown>>>;
}
