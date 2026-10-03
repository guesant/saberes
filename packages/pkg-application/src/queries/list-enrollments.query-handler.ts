import type { StudyRecord } from "../models/index";
import type { ListEnrollmentsPort } from "../ports/index";

export class ListEnrollmentsQueryHandler {
  public constructor(private readonly port: ListEnrollmentsPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
