import type { SaveDiagnosisPort } from "../application.ports.ts";
import type { DiagnosisRecord } from "../models/progress.models.ts";

export class SaveDiagnosisCommandHandler {
  public constructor(private readonly port: SaveDiagnosisPort) {}

  public execute(diagnosis: DiagnosisRecord): Promise<void> {
    return this.port.execute(diagnosis);
  }
}
