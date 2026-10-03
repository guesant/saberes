import type { SaveDiagnosisPort } from "../ports/index";
import type { DiagnosisRecord } from "@guesant/saberes-domain";

export class SaveDiagnosisCommandHandler {
  public constructor(private readonly port: SaveDiagnosisPort) {}

  public execute(diagnosis: DiagnosisRecord): Promise<void> {
    return this.port.execute(diagnosis);
  }
}
