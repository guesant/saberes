import type { StudyRecord } from "../models/index";
import type { ListTopicMasteryPort } from "../ports/index";

export class ListTopicMasteryQueryHandler {
  public constructor(private readonly port: ListTopicMasteryPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
