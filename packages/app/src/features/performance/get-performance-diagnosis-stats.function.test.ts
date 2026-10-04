import { DiagnosisCode } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { getPerformanceDiagnosisStats } from "./get-performance-diagnosis-stats.function";

describe("getPerformanceDiagnosisStats", () => {
  it("identifica diagnósticos recorrentes", () => {
    const result = getPerformanceDiagnosisStats([
      { diagnosis: DiagnosisCode.ConceptGap },
      { diagnosis: DiagnosisCode.ConceptGap },
      { diagnosis: DiagnosisCode.Inattention },
    ]);

    expect(result).toEqual([
      { attempts: 2, code: DiagnosisCode.ConceptGap },
      { attempts: 1, code: DiagnosisCode.Inattention },
    ]);
  });
});
