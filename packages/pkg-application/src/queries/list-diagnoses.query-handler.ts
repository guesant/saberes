import type { ListDiagnosesPort } from "../application.ports.ts";
import type { DiagnosisRecord } from "../models/progress.models.ts";

export class ListDiagnosesQueryHandler {
  public constructor(private readonly port: ListDiagnosesPort) {}

  public execute(): Promise<DiagnosisRecord[]> {
    return this.port.execute();
  }
}
