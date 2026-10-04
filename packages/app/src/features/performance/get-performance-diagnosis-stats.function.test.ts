import { actionForDiagnosis, DiagnosisCode, PedagogicalAction } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { getPerformanceDiagnosisStats } from "./get-performance-diagnosis-stats.function";

describe("getPerformanceDiagnosisStats", () => {
  it("identifica diagnósticos recorrentes", () => {
    const result = getPerformanceDiagnosisStats({
      actionForDiagnosis,
      attempts: [
        { diagnosis: DiagnosisCode.ConceptGap },
        { diagnosis: DiagnosisCode.ConceptGap },
        { diagnosis: DiagnosisCode.Inattention },
      ],
    });

    expect(result).toEqual([
      { action: PedagogicalAction.Theory, attempts: 2, code: DiagnosisCode.ConceptGap },
      { action: PedagogicalAction.Retry, attempts: 1, code: DiagnosisCode.Inattention },
    ]);
  });
});
