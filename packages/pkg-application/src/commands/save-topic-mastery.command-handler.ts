import type { StudyRecord } from "../models/index";
import type { SaveTopicMasteryPort } from "../ports/index";

export class SaveTopicMasteryCommandHandler {
  public constructor(private readonly port: SaveTopicMasteryPort) {}

  public execute(input: Parameters<SaveTopicMasteryPort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
