import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { ProgressDatabase } from "./progress.database";
import type { StudySession } from "@guesant/saberes-application";

const progressDb = new ProgressDatabase();

const activeSimulation: StudySession = {
  id: "simulation-local-1",
  mode: "simulation",
  status: "active",
  revision: 0,
  startedAt: "2026-10-05T10:00:00.000Z",
  expiresAt: "2026-10-05T15:00:00.000Z",
  questionKeys: ["question:occurrence-1", "question:occurrence-2"],
};

describe("simulados salvos no banco de progresso local", () => {
  beforeEach(async () => {
    await progressDb.clearProgress();
  });

  it("salva respostas em rascunho com revisão crescente e rejeita questões alheias", async () => {
    await progressDb.saveSession(activeSimulation);

    const saved = await progressDb.updateSimulationSession({
      sessionId: activeSimulation.id,
      questionKey: "question:occurrence-1",
      answer: "B",
      hintIdsUsed: [3],
      updatedAt: "2026-10-05T10:01:00.000Z",
    });

    expect(saved.revision)
      .toBe(1);

    expect(saved.simulationAnswers)
      .toEqual([expect.objectContaining({
        questionKey: "question:occurrence-1",
        value: "B",
        hintIdsUsed: [3],
      })]);

    const revised = await progressDb.updateSimulationSession({
      sessionId: activeSimulation.id,
      questionKey: "question:occurrence-1",
      answer: "C",
      updatedAt: "2026-10-05T10:02:00.000Z",
    });

    expect(revised.simulationAnswers?.[0].hintIdsUsed)
      .toEqual([3]);

    await expect(progressDb.updateSimulationSession({
      sessionId: activeSimulation.id,
      questionKey: "question:outside-assessment",
      answer: "A",
      updatedAt: "2026-10-05T10:02:00.000Z",
    })).rejects.toThrow("Questão não pertence ao simulado.");
  });

  it("conclui sessão e persiste tentativas atomicamente, sem duplicar a segunda conclusão", async () => {
    const started = { ...activeSimulation, revision: 1 };

    const completed: StudySession = { ...started, status: "completed", completedAt: "2026-10-05T10:10:00.000Z" };

    const attempt = {
      id: "simulation-local-1:simulation:question:occurrence-1",
      sessionId: activeSimulation.id,
      contentKey: "question:occurrence-1",
      questionId: "1",
      topicIds: [],
      answer: "A",
      isCorrect: true,
      source: "simulation",
    };

    await progressDb.saveSession(started);

    await progressDb.completeSimulationSession({ session: completed, attempts: [attempt], expectedRevision: 1 });

    await progressDb.completeSimulationSession({ session: completed, attempts: [attempt], expectedRevision: 1 });

    expect(await progressDb.getSession(activeSimulation.id))
      .toMatchObject({ status: "completed" });

    expect(await progressDb.listAttempts())
      .toHaveLength(1);
  });

  it("não grava tentativas inválidas antes de validar o conjunto inteiro", async () => {
    const started = { ...activeSimulation, revision: 1 };

    const completed: StudySession = { ...started, status: "completed", completedAt: "2026-10-05T10:10:00.000Z" };

    const validAttempt = {
      id: "attempt-valid",
      sessionId: activeSimulation.id,
      contentKey: "question:occurrence-1",
      questionId: "1",
      topicIds: [],
      answer: "A",
      isCorrect: true,
      source: "simulation",
    };

    await progressDb.saveSession(started);

    await expect(progressDb.completeSimulationSession({
      session: completed,
      attempts: [validAttempt, { ...validAttempt, id: undefined }],
      expectedRevision: 1,
    })).rejects.toThrow("Tentativa inválida para este simulado.");

    expect(await progressDb.listAttempts())
      .toHaveLength(0);
  });
});
