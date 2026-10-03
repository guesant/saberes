import type { GetStreakPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class GetStreakQueryHandler {
  public constructor(private readonly port: GetStreakPort) {}

  public execute(): Promise<StudyRecord | undefined> {
    return this.port.execute();
  }
}
