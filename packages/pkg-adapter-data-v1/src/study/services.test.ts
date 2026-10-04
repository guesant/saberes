import {
  actionForDiagnosis,
  calculateTopicMastery,
  defineAchievements,
  DiagnosisCode,
  FsrsRating,
  PedagogicalAction,
  recommendNext,
  ReviewTargetType,
  suggestDiagnosis,
} from "@guesant/saberes-domain";
import { describe, expect, it } from "vitest";
import { scheduleReview } from "../adapters/review/fsrs/schedule-review.function";

describe("serviços pedagógicos locais", () => {
  it("calcula domínio por tópico a partir das tentativas", () => {
    const mastery = calculateTopicMastery([
      { topicIds: [1, 2], isCorrect: true, answeredAt: "2026-01-01" },
      { topicIds: [1], isCorrect: false, answeredAt: "2026-01-02" },
      { topicIds: [2], isCorrect: null },
    ]);

    expect(mastery["1"]).toMatchObject({
      total: 2,
      correct: 1,
      percentage: 50,
    });

    expect(mastery["2"]).toMatchObject({
      total: 1,
      correct: 1,
      percentage: 100,
    });
  });

  it("prioriza erros recentes e respeita pré-requisitos", () => {
    const next = recommendNext({
      incompleteItems: [
        { id: "a", topicId: 1 },
        { id: "b", topicId: 2 },
      ],
      prerequisites: [{ topicId: 1, completed: false }],
      recentErrors: [{ topicIds: [2] }],
    });

    expect(next.id).toBe("b");
  });

  it("desbloqueia conquistas sem depender de servidor", () => {
    const achievements = defineAchievements({
      attempts: 10,
      correct: 10,
      lessons: 1,
      sessions: 1,
      streak: 7,
      courses: 0,
      reviews: 0,
    });

    expect(achievements.find((item) => item.key === "first-question")?.isUnlocked).toBe(true);

    expect(achievements.find((item) => item.key === "seven-day-streak")?.isUnlocked).toBe(true);

    expect(achievements.find((item) => item.key === "first-course")?.isUnlocked).toBe(false);
  });

  it("separa diagnóstico pedagógico do agendamento de memória", () => {
    expect(suggestDiagnosis({ isCorrect: false, elapsedMs: 1000 })).toBe("inattention");

    expect(actionForDiagnosis(DiagnosisCode.ConceptGap)).toBe(PedagogicalAction.Theory);

    const review = scheduleReview(
      {
        contentKey: "question:test",
        targetType: ReviewTargetType.Question,
      },
      FsrsRating.Again,
      { now: new Date(), createDate: (value) => new Date(value), requestRetention: 0.9 },
    );

    expect(review.schedulerVersion).toBe("ts-fsrs-v6");

    expect(review.dueAt).toBeTruthy();
  });
});
