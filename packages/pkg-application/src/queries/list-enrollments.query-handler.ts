import type { ListEnrollmentsPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class ListEnrollmentsQueryHandler {
  public constructor(private readonly port: ListEnrollmentsPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
