import type { SavePlanProgressPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class SavePlanProgressCommandHandler {
  public constructor(private readonly port: SavePlanProgressPort) {}

  public execute(input: Parameters<SavePlanProgressPort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
