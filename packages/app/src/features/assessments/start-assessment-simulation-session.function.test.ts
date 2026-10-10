import { describe, expect, it, vi } from "vitest";
import { startAssessmentSimulationSession } from "./start-assessment-simulation-session.function";
import type { ApplicationServices, AssessmentDetailsReadModel } from "@guesant/saberes-application";

describe("startAssessmentSimulationSession", () => {
  it("persists only an explicitly approved cancelled-question scoring policy", async () => {
    const saveSession = vi.fn(async () => undefined);
    const navigate = vi.fn();
    const assessment: AssessmentDetailsReadModel = {
      id: 50,
      slug: "official-exam",
      title: "Prova oficial",
      description: "",
      kind: "exam",
      duration_minutes: 300,
      is_published: 1,
      expected_question_count: 1,
      canSimulate: true,
      readinessReason: "",
      cancelledQuestionPolicy: "award_max_points",
    };

    await startAssessmentSimulationSession({
      assessmentKey: "assessment:official-exam",
      assessment,
      items: [{ position: 1, questionKey: "question:cancelled", max_points: 1 }],
      services: {
        platform: { ids: { execute: () => "simulation-50" } },
        progress: { saveSession: { execute: saveSession } },
      } as unknown as ApplicationServices,
      navigate,
    });

    expect(saveSession).toHaveBeenCalledWith(expect.objectContaining({
      mode: "simulation",
      contentKey: "assessment:official-exam",
      questionKeys: ["question:cancelled"],
      cancelledQuestionPolicy: "award_max_points",
    }));
    expect(navigate).toHaveBeenCalledWith("/sessoes/questoes/simulation-50");
  });
});
