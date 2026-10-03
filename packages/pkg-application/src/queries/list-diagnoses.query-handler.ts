import type { ListDiagnosesPort } from "../ports/index";
import type { DiagnosisRecord } from "@guesant/saberes-domain";

export class ListDiagnosesQueryHandler {
  public constructor(private readonly port: ListDiagnosesPort) {}

  public execute(): Promise<DiagnosisRecord[]> {
    return this.port.execute();
  }
}
