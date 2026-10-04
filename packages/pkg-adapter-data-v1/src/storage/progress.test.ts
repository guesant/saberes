import "fake-indexeddb/auto";
import {
  AttemptConfidence,
  DiagnosisCode,
  DiagnosisConfidence,
  DiagnosisSource,
  PedagogicalAction,
  ReviewTargetType,
} from "@guesant/saberes-domain";
import { beforeEach, describe, expect, it } from "vitest";
import { ProgressDatabase } from "./progress.database";

const progressDb = new ProgressDatabase();

describe("progresso local Dexie", () => {
  beforeEach(async () => {
    await progressDb.clearProgress();
  });

  it("preserva tentativas, diagnóstico e agenda no mesmo banco local", async () => {
    const attempt = await progressDb.saveAttempt({
      contentKey: "question:sample-2026-1",
      confidence: AttemptConfidence.Guess,
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

    expect((await progressDb.listAttempts())[0]).toMatchObject({
      confidence: AttemptConfidence.Guess,
    });

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

  it("lista sessões de estudo persistidas localmente", async () => {
    await progressDb.saveSession({
      id: "session-1",
      activityType: "lesson",
      contentKey: "lesson:sample",
      startedAt: "2026-10-04T10:00:00.000Z",
      completedAt: "2026-10-04T10:20:00.000Z",
      durationMs: 1200000,
    });

    expect(await progressDb.listSessions()).toEqual([
      expect.objectContaining({
        activityType: "lesson",
        contentKey: "lesson:sample",
        id: "session-1",
      }),
    ]);
  });

  it("exporta e restaura o progresso sem tocar no conteúdo editorial", async () => {
    await progressDb.enrollCourse("course:sample", { startedAt: "2026-10-03T00:00:00.000Z" });

    await progressDb.saveSetting("theme", "light");

    const snapshot = await progressDb.exportProgress();

    await progressDb.clearProgress();

    await progressDb.importProgress(snapshot);

    expect(await progressDb.listEnrollments()).toEqual([
      expect.objectContaining({ contentKey: "course:sample" }),
    ]);

    expect(await progressDb.getSetting("theme")).toEqual({ key: "theme", value: "light" });
  });

  it("rejeita um snapshot inválido antes de alterar o progresso", async () => {
    await progressDb.enrollCourse("course:sample");

    await expect(progressDb.importProgress("{}")).rejects.toThrow("formato inválido");

    expect(await progressDb.listEnrollments()).toHaveLength(1);
  });
});
