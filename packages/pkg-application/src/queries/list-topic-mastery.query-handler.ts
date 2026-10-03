import type { ListTopicMasteryPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class ListTopicMasteryQueryHandler {
  public constructor(private readonly port: ListTopicMasteryPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
