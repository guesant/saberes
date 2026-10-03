import type { StudyRecord } from "../models/index";
import type { SavePlanProgressPort } from "../ports/index";

export class SavePlanProgressCommandHandler {
  public constructor(private readonly port: SavePlanProgressPort) {}

  public execute(input: Parameters<SavePlanProgressPort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
