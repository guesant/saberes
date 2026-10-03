import type { SyncAchievementsPort } from "../ports/index";

export class SyncAchievementsCommandHandler {
  public constructor(private readonly port: SyncAchievementsPort) {}

  public execute(stats?: Record<string, number>): Promise<Array<Record<string, unknown>>> {
    return this.port.execute(stats);
  }
}
