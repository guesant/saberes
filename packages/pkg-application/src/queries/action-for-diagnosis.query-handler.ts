import type { ActionForDiagnosisPort } from "../application.ports.ts";
import type { DiagnosisCode, PedagogicalAction } from "@guesant/saberes-domain";

export class ActionForDiagnosisQueryHandler {
  public constructor(private readonly port: ActionForDiagnosisPort) {}

  public execute(code: DiagnosisCode): PedagogicalAction {
    return this.port.execute(code);
  }
}
