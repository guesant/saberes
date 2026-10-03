import type { StudyRecord } from "../models/index.ts";
import type { ListEnrollmentsPort } from "../ports/index.ts";

export class ListEnrollmentsQueryHandler {
  public constructor(private readonly port: ListEnrollmentsPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
