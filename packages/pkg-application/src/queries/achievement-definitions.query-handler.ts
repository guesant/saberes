import type { AchievementDefinitionsPort } from "../ports/index.ts";

export class AchievementDefinitionsQueryHandler {
  public constructor(private readonly port: AchievementDefinitionsPort) {}

  public execute(stats?: Record<string, number>): Array<Record<string, unknown>> {
    return this.port.execute(stats);
  }
}
