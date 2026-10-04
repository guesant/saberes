import { actionForDiagnosis, DiagnosisCode, PedagogicalAction } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { getPerformanceDiagnosisStats } from "./get-performance-diagnosis-stats.function";

const diagnosisInput = {
  actionForDiagnosis,
  attempts: [
    {
      answeredAt: "2026-10-04T10:00:00.000Z",
      diagnosis: DiagnosisCode.ConceptGap,
      questionId: "question-1",
      sessionId: "session-1",
      topicIds: ["topic-1"],
    },
    { diagnosis: DiagnosisCode.ConceptGap, questionId: "question-2", topicIds: ["topic-2"] },
    { diagnosis: DiagnosisCode.Inattention },
  ],
  now: new Date("2026-10-04T12:00:00.000Z"),
};

const diagnosisExpected = [
  {
    action: PedagogicalAction.Theory,
    attempts: 2,
    code: DiagnosisCode.ConceptGap,
    recentAttempts: 1,
    questionCount: 2,
    sessionCount: 1,
    topicCount: 2,
  },
  {
    action: PedagogicalAction.Retry,
    attempts: 1,
    code: DiagnosisCode.Inattention,
    recentAttempts: 0,
    questionCount: 0,
    sessionCount: 0,
    topicCount: 0,
  },
];

describe("getPerformanceDiagnosisStats", () => {
  it("identifica diagnósticos recorrentes", () => {
    expect(getPerformanceDiagnosisStats(diagnosisInput)).toEqual(diagnosisExpected);
  });
});
