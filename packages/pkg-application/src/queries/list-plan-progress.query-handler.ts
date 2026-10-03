import type { ListPlanProgressPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class ListPlanProgressQueryHandler {
  public constructor(private readonly port: ListPlanProgressPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
