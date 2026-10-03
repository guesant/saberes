import type { StudyRecord } from "../models/index";
import type { GetStreakPort } from "../ports/index";

export class GetStreakQueryHandler {
  public constructor(private readonly port: GetStreakPort) {}

  public execute(): Promise<StudyRecord | undefined> {
    return this.port.execute();
  }
}
