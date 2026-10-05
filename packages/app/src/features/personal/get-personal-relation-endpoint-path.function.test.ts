import { describe, expect, it } from "vitest";
import { getPersonalRelationEndpointPath } from "./get-personal-relation-endpoint-path.function";

describe("getPersonalRelationEndpointPath", () => {
  it("opens study topics in the topic context", () => {
    expect(getPersonalRelationEndpointPath({ id: "topic-1", recordType: "topic" }))
      .toBe("/topicos/topic-1");
  });

  it("opens personal records in the personal context", () => {
    expect(getPersonalRelationEndpointPath({ id: "note-1", recordType: "note" }))
      .toBe("/meu-espaco#personal-note-note-1");
  });

  it("opens goals and questions in their owner contexts", () => {
    expect(getPersonalRelationEndpointPath({ id: "goal-1", recordType: "goal" }))
      .toBe("/metas#goal-goal-1");

    expect(getPersonalRelationEndpointPath({ id: "question-1", recordType: "question" }))
      .toBe("/questoes/question-1");
  });

  it("encodes endpoint identifiers", () => {
    expect(getPersonalRelationEndpointPath({ id: "note/one", recordType: "note" }))
      .toBe("/meu-espaco#personal-note-note%2Fone");
  });
});
