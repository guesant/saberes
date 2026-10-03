import "fake-indexeddb/auto";
import {
  DiagnosisCode,
  DiagnosisConfidence,
  DiagnosisSource,
  PedagogicalAction,
  ReviewTargetType,
} from "@guesant/saberes-domain";
import { beforeEach, describe, expect, it } from "vitest";
import { progressDb } from "./progress.storage";

describe("progresso local Dexie", () => {
  beforeEach(async () => {
    await progressDb.clearProgress();
  });

  it("preserva tentativas, diagnóstico e agenda no mesmo banco local", async () => {
    const attempt = await progressDb.saveAttempt({
      contentKey: "question:sample-2026-1",
      topicIds: ["1"],
      isCorrect: false,
    });

    await progressDb.saveDiagnosis({
      attemptId: attempt.id,
      code: DiagnosisCode.ConceptGap,
      confidence: DiagnosisConfidence.High,
      suggestedBy: DiagnosisSource.Student,
      action: PedagogicalAction.Theory,
    });

    await progressDb.saveReviewTarget("question:sample-2026-1", {
      targetType: ReviewTargetType.Question,
      dueAt: new Date().toISOString(),
      stability: 1.2,
    });

    expect(await progressDb.listAttempts()).toHaveLength(1);

    expect((await progressDb.listDiagnoses())[0]).toMatchObject({
      attemptId: attempt.id,
      code: "concept_gap",
    });

    expect((await progressDb.listReviewTargets())[0]).toMatchObject({
      contentKey: "question:sample-2026-1",
      targetType: "question",
    });
  });

  it("mantém o banco aberto para novas versões do conteúdo", async () => {
    expect(progressDb.name).toBe("saberes-progress");

    expect(progressDb.verno).toBeGreaterThanOrEqual(4);
  });
});
