import "fake-indexeddb/auto";
import { ProgressDatabase } from "@guesant/saberes-adapter-data-v1/progress";
import { AttemptConfidence, RecordAttemptCommandHandler } from "@guesant/saberes-application";
import { afterEach, expect, it, vi } from "vitest";
import { submitQuestionAnswer } from "../features/exercises/submit-question-answer.function";
import type { ApplicationServices, Attempt, QuestionReadModel } from "@guesant/saberes-application";

vi.mock("../features/exercises/sync-question-submission.function", () => {
  return { syncQuestionSubmission: vi.fn() };
});

const databaseName = "question-submission-persistence-test";

type RecordTestAttempt = (attempt: Attempt) => Promise<Attempt>;

const data: QuestionReadModel = {
  question: { question_id: 342, occurrence_id: 342, canonical_key: "exercise:test-question",
    occurrence_key: "question:test-occurrence", type: "single_choice", correct_answer: "B",
    is_automatically_gradable: true, training_eligible: true, editorial_version: "1",
    answer_key_version: "2", source_edition_slug: "unicamp-2026", source_stage_slug: "primeira-fase" },
  options: [], parts: [], topics: [], related: [],
};

afterEach(async () => {
  const db = new ProgressDatabase(databaseName);

  await db.delete();
});

it("grades and preserves the answer, canonical identity and versions after reopening", async () => {
  const db = new ProgressDatabase(databaseName);

  const services = { exercises: { recordAttempt: { execute: (attempt: Attempt) => {
    return db.saveAttempt(attempt);
  } } } } as ApplicationServices;

  const result = await submitQuestionAnswer({ data, services, answer: "B", confidence: AttemptConfidence.Confident, elapsedMs: 1000 });

  expect(result.correct)
    .toBe(true);

  db.close();

  const reopened = new ProgressDatabase(databaseName);

  expect(await reopened.listAttempts())
    .toEqual([expect.objectContaining({ answer: "B", isCorrect: true,
      canonicalQuestionId: 342, questionContentVersion: "1", answerKeyVersion: "2" })]);

  reopened.close();
});

it("never records a provisional occurrence even when reached by a direct link", async () => {
  const execute = vi.fn<RecordTestAttempt>();

  const services = { exercises: { recordAttempt: new RecordAttemptCommandHandler({ execute }) } } as ApplicationServices;

  await expect(submitQuestionAnswer({ data: { ...data, question: { ...data.question, training_eligible: false } },
    services, answer: "B", confidence: AttemptConfidence.Confident, elapsedMs: 1000 })).rejects.toThrow("somente para consulta");

  expect(execute).not.toHaveBeenCalled();
});
