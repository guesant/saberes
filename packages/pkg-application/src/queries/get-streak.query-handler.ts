import type { StudyRecord } from "../models/index.ts";
import type { GetStreakPort } from "../ports/index.ts";

export class GetStreakQueryHandler {
  public constructor(private readonly port: GetStreakPort) {}

  public execute(): Promise<StudyRecord | undefined> {
    return this.port.execute();
  }
}
