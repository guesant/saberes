import type { StudyRecord } from "../models/index.ts";
import type { ListTopicMasteryPort } from "../ports/index.ts";

export class ListTopicMasteryQueryHandler {
  public constructor(private readonly port: ListTopicMasteryPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
