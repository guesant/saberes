import { describe, expect, it } from "vitest";
import { getPersonalCaptureContentPath } from "./get-personal-capture-content-path.function";

describe("getPersonalCaptureContentPath", () => {
  it("opens supported editorial records without changing their canonical key", () => {
    expect(getPersonalCaptureContentPath("question:question-1"))
      .toBe("/questoes/question-1");

    expect(getPersonalCaptureContentPath("lesson:lesson-1"))
      .toBe("/licoes/lesson-1");

    expect(getPersonalCaptureContentPath("topic:topic-1"))
      .toBe("/topicos/topic-1");
  });

  it("does not invent a route for an unsupported or incomplete key", () => {
    expect(getPersonalCaptureContentPath(undefined))
      .toBeNull();

    expect(getPersonalCaptureContentPath("note:note-1"))
      .toBeNull();

    expect(getPersonalCaptureContentPath("question:"))
      .toBeNull();
  });
});
