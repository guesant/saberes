import type { StudyRecord } from "../models/index";
import type { ListPlanProgressPort } from "../ports/index";

export class ListPlanProgressQueryHandler {
  public constructor(private readonly port: ListPlanProgressPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
