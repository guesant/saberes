import type { DiagnosisRecord } from "../models/index.ts";
import type { ListDiagnosesPort } from "../ports/index.ts";

export class ListDiagnosesQueryHandler {
  public constructor(private readonly port: ListDiagnosesPort) {}

  public execute(): Promise<DiagnosisRecord[]> {
    return this.port.execute();
  }
}
