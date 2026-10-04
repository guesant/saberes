import "fake-indexeddb/auto";
import {
  AttemptConfidence,
  AcademicModality,
  DiagnosisCode,
  DiagnosisConfidence,
  DiagnosisSource,
  LearningCourseType,
  PedagogicalAction,
  ReviewTargetType,
  FocusSessionStatus,
  StudyGoalMetric,
  StudyGoalStatus,
} from "@guesant/saberes-domain";
import { beforeEach, describe, expect, it } from "vitest";
import { ProgressDatabase } from "./progress.database";

const progressDb = new ProgressDatabase();

interface ProgressSnapshot {
  schemaVersion: number;
  stores: Record<string, unknown[]>;
}

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
      dueAt: new Date()
        .toISOString(),
      stability: 1.2,
    });

    expect(await progressDb.listAttempts())
      .toHaveLength(1);

    expect((await progressDb.listAttempts())[0])
      .toMatchObject({
        confidence: AttemptConfidence.Guess,
      });

    expect((await progressDb.listDiagnoses())[0])
      .toMatchObject({
        attemptId: attempt.id,
        code: "concept_gap",
      });

    expect((await progressDb.listReviewTargets())[0])
      .toMatchObject({
        contentKey: "question:sample-2026-1",
        targetType: "question",
      });
  });

  it("mantém o banco aberto para novas versões do conteúdo", async () => {
    expect(progressDb.name)
      .toBe("saberes-progress");

    expect(progressDb.verno)
      .toBeGreaterThanOrEqual(7);
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

    expect(await progressDb.listSessions())
      .toEqual([
        expect.objectContaining({
          activityType: "lesson",
          contentKey: "lesson:sample",
          id: "session-1",
        }),
      ]);
  });

  it("recupera uma sessão interrompida após reabrir o banco local", async () => {
    await progressDb.saveSession({
      id: "session-interrupted",
      activityType: "question",
      contentKey: "question:fixture-primeiro-estudo",
      startedAt: "2026-10-04T10:00:00.000Z",
      durationMs: 300000,
      questionKeys: ["question:fixture-primeiro-estudo"],
      answeredQuestionKeys: [],
      skippedQuestionKeys: [],
      currentQuestionIndex: 0,
    });

    const reopenedProgressDb = new ProgressDatabase();

    try {
      await expect(reopenedProgressDb.getSession("session-interrupted")).resolves.toMatchObject({
        contentKey: "question:fixture-primeiro-estudo",
        currentQuestionIndex: 0,
      });
    } finally {
      reopenedProgressDb.close();
    }
  });

  it("persiste metas, foco e situação acadêmica na versão atual do banco", async () => {
    const now = "2026-10-04T10:00:00.000Z";

    await progressDb.saveStudyGoal({
      contentKey: "goal:daily-study",
      title: "Estudar diariamente",
      metric: StudyGoalMetric.Minutes,
      target: 30,
      current: 10,
      status: StudyGoalStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    await progressDb.saveFocusSession({
      id: "focus-1",
      status: FocusSessionStatus.Completed,
      startedAt: now,
      endedAt: "2026-10-04T10:30:00.000Z",
      elapsedMs: 1800000,
    });

    await progressDb.saveAcademicDiscipline({
      id: "discipline-1",
      name: "Matemática",
      modality: AcademicModality.InPerson,
      totalClasses: 10,
      attendedClasses: 9,
      minimumAttendancePercentage: 75,
      minimumGrade: 5,
      grades: [],
      updatedAt: now,
    });

    expect(await progressDb.listStudyGoals())
      .toHaveLength(1);

    expect(await progressDb.listFocusSessions())
      .toHaveLength(1);

    expect(await progressDb.listAcademicDisciplines())
      .toHaveLength(1);

    const snapshot: ProgressSnapshot = JSON.parse(await progressDb.exportProgress());

    expect(snapshot.schemaVersion)
      .toBe(2);

    expect(snapshot.stores.studyGoals)
      .toHaveLength(1);

    expect(snapshot.stores.focusSessions)
      .toHaveLength(1);

    expect(snapshot.stores.academicDisciplines)
      .toHaveLength(1);

    await progressDb.deleteAcademicDiscipline("discipline-1");

    expect(await progressDb.listAcademicDisciplines())
      .toHaveLength(0);
  });

  it("persiste, lista e remove filtros do catálogo localmente", async () => {
    await progressDb.saveSavedCatalogFilter({
      id: "filter-1",
      name: "Questões gerais",
      filters: { courseType: LearningCourseType.General, search: "funções" },
      updatedAt: "2026-10-04T10:00:00.000Z",
    });

    expect(await progressDb.listSavedCatalogFilters())
      .toEqual([
        {
          id: "filter-1",
          name: "Questões gerais",
          filters: { courseType: LearningCourseType.General, search: "funções" },
          updatedAt: "2026-10-04T10:00:00.000Z",
        },
      ]);

    await progressDb.deleteSavedCatalogFilter("filter-1");

    expect(await progressDb.listSavedCatalogFilters())
      .toEqual([]);
  });

  it("exporta e restaura o progresso sem tocar no conteúdo editorial", async () => {
    await progressDb.enrollCourse("course:sample", { startedAt: "2026-10-03T00:00:00.000Z" });

    await progressDb.saveSetting("theme", "light");

    const snapshot = await progressDb.exportProgress();

    expect((await progressDb.listBackupEvents())[0])
      .toMatchObject({
        operation: "export",
        result: "success",
        checksum: expect.any(String),
      });

    await progressDb.clearProgress();

    await progressDb.importProgress({ snapshot, strategy: "replace" });

    expect(await progressDb.listEnrollments())
      .toEqual([
        expect.objectContaining({ contentKey: "course:sample" }),
      ]);

    expect(
      (await progressDb.listBackupEvents()).some((event) => {
        return event.operation === "import";
      }),
    )
      .toBe(true);

    expect(await progressDb.getSetting("theme"))
      .toEqual({ key: "theme", value: "light" });
  });

  it("rejeita um snapshot inválido antes de alterar o progresso", async () => {
    await progressDb.enrollCourse("course:sample");

    await expect(
      progressDb.importProgress({ snapshot: "{}", strategy: "replace" }),
    ).rejects.toThrow("formato inválido");

    expect(await progressDb.listEnrollments())
      .toHaveLength(1);

    expect((await progressDb.listBackupEvents())[0])
      .toMatchObject({
        operation: "import",
        result: "rejected",
      });
  });

  it("rejeita checksum adulterado sem substituir o progresso atual", async () => {
    await progressDb.enrollCourse("course:current");

    const snapshot = await progressDb.exportProgress();

    const corruptedSnapshot = snapshot.replace(/"checksum":"[^"]+"/, '"checksum":"alterado"');

    await expect(
      progressDb.importProgress({ snapshot: corruptedSnapshot, strategy: "replace" }),
    ).rejects.toThrow("corrompido");

    expect(await progressDb.listEnrollments())
      .toEqual([
        expect.objectContaining({ contentKey: "course:current" }),
      ]);

    expect(
      (await progressDb.listBackupEvents()).some((event) => {
        return (
          event.operation === "import" &&
          event.result === "rejected" &&
          event.errorMessage === "Checksum inválido"
        );
      }),
    )
      .toBe(true);
  });

  it("mescla um backup sem apagar o progresso atual", async () => {
    await progressDb.enrollCourse("course:backup");

    const snapshot = await progressDb.exportProgress();

    await progressDb.clearProgress();

    await progressDb.enrollCourse("course:current");

    await progressDb.importProgress({ snapshot, strategy: "merge" });

    expect(await progressDb.listEnrollments())
      .toEqual(
        expect.arrayContaining([
          expect.objectContaining({ contentKey: "course:backup" }),
          expect.objectContaining({ contentKey: "course:current" }),
        ]),
      );
  });

  it("preserva progresso associado a conteúdo ainda não publicado", async () => {
    await progressDb.saveBookmark("lesson:content-not-yet-published");

    const snapshot = await progressDb.exportProgress();

    await progressDb.clearProgress();

    await progressDb.importProgress({ snapshot, strategy: "replace" });

    expect(await progressDb.listBookmarks())
      .toEqual([
        expect.objectContaining({ contentKey: "lesson:content-not-yet-published" }),
      ]);
  });
});
