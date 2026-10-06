import { StudyGoalMetric, StudyGoalStatus } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { createPersonalProgressReadModel } from "./create-personal-progress-read-model.function";
import { findPersonalProgressLink } from "./find-personal-progress-link.function";
import type { CreatePersonalProgressReadModelInput } from "./create-personal-progress-read-model-input.interface";

const connectedInput: CreatePersonalProgressReadModelInput = {
  activities: [
    {
      contentReference: { type: "topic", id: "algebra" },
      createdAt: "2026-10-05T10:00:00.000Z",
      description: "Retomar prática",
      id: "activity-1",
      status: "planned",
      title: "Praticar álgebra",
      updatedAt: "2026-10-05T10:00:00.000Z",
    },
  ],
  attempts: [
    {
      contentKey: "question:1",
      id: "attempt-1",
      isCorrect: true,
      questionId: "1",
      sessionId: "session-1",
      topicIds: ["algebra"],
    },
  ],
  goals: [
    {
      contentKey: "topic:algebra",
      createdAt: "2026-10-05T10:00:00.000Z",
      current: 1,
      metric: StudyGoalMetric.Questions,
      status: StudyGoalStatus.Active,
      target: 5,
      title: "Resolver questões",
      updatedAt: "2026-10-05T10:00:00.000Z",
    },
  ],
  sessions: [
    {
      contentKey: "topic:algebra",
      id: "session-1",
      questionKeys: ["question:1"],
      status: "completed",
    },
  ],
};

const unlinkedInput: CreatePersonalProgressReadModelInput = {
  activities: [
    {
      createdAt: "2026-10-05T10:00:00.000Z",
      description: "Sem origem",
      id: "activity-1",
      status: "planned",
      title: "Captura",
      updatedAt: "2026-10-05T10:00:00.000Z",
    },
  ],
  attempts: [{ id: "attempt-1" }],
  goals: [],
  sessions: [{ id: "session-1" }],
};

describe("createPersonalProgressReadModel", () => {
  it("conecta as evidências pela chave canônica", () => {
    const result = createPersonalProgressReadModel(connectedInput);

    const topicLink = findPersonalProgressLink(result.links, "topic:algebra");

    const questionLink = findPersonalProgressLink(result.links, "question:1");

    expect(topicLink)
      .toMatchObject({
        activityIds: ["activity-1"],
        attemptCount: 1,
        correctAttemptCount: 1,
        goalContentKeys: ["topic:algebra"],
        sessionIds: ["session-1"],
      });

    expect(questionLink)
      .toMatchObject({
        attemptCount: 1,
        correctAttemptCount: 1,
        questionKeys: ["question:1"],
        sessionIds: ["session-1"],
      });
  });

  it("preserva evidências sem vínculo para recuperação posterior", () => {
    expect(createPersonalProgressReadModel(unlinkedInput))
      .toEqual({
        links: [],
        unlinkedActivityIds: ["activity-1"],
        unlinkedAttemptIds: ["attempt-1"],
        unlinkedSessionIds: ["session-1"],
      });
  });
});
