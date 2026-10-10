import { expect, it, vi } from "vitest";
import { startAssessmentSession } from "./start-assessment-session.function";
import type { StartAssessmentSessionInput } from "./start-assessment-session-input.interface";
import type { ApplicationServices } from "@guesant/saberes-application";

it("rejects consultation-only assessments before creating a session", async () => {
  const navigate = vi.fn();

  const input: StartAssessmentSessionInput = {
    assessmentKey: "assessment:draft", assessment: {canPractice: false, canSimulate: false, id: 1, slug: "draft", title: "Caderno", description: "", kind: "exam", duration_minutes: 300, is_published: 0, expected_question_count: 72, readinessReason: "review"}, navigate,
    mode: "practice", questionKeys: ["question:1"], items: [],
    services: {} as ApplicationServices,
  };

  await expect(startAssessmentSession(input)).rejects.toThrow(/consulta/);

  expect(navigate).not.toHaveBeenCalled();
});
