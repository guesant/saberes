import type { DiagnosisRecord } from "../models/index.ts";
import type { SaveDiagnosisPort } from "../ports/index.ts";

export class SaveDiagnosisCommandHandler {
  public constructor(private readonly port: SaveDiagnosisPort) {}

  public execute(diagnosis: DiagnosisRecord): Promise<void> {
    return this.port.execute(diagnosis);
  }
}
