import type { StudyRecord } from "../models/index.ts";
import type { SavePlanProgressPort } from "../ports/index.ts";

export class SavePlanProgressCommandHandler {
  public constructor(private readonly port: SavePlanProgressPort) {}

  public execute(input: Parameters<SavePlanProgressPort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
