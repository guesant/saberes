// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AssessmentConsultationNotice } from "./assessment-consultation-notice.component";
import { AssessmentTrainingAvailability } from "./assessment-training-availability.component";
import type { AssessmentDetailsReadModel } from "@guesant/saberes-application";

vi.mock("react-i18next", () => {return {
  useTranslation: function useTranslation() {
    return {
      t: function translate(key: string) {
        return key;
      },
    };
  },
};});

afterEach(() => {return cleanup();});

const completeCancelledAssessment: AssessmentDetailsReadModel = {
  id: 50,
  slug: "vu-2025-fase1-qz",
  title: "Unicamp 2025 — caderno QZ",
  description: "",
  kind: "exam",
  duration_minutes: 300,
  is_published: 1,
  expected_question_count: 72,
  canSimulate: true,
  canPractice: true,
  cancelledQuestionCount: 1,
  practiceQuestionKeys: ["question:1"],
  readinessReason: "cancelled_question",
};

describe("assessment availability notices", () => {
  it("explains that a complete simulation is available with an officially cancelled item", () => {
    render(<>
      <AssessmentConsultationNotice canPractice canSimulate hasCancelledQuestions />
      <AssessmentTrainingAvailability assessment={completeCancelledAssessment} />
    </>);

    expect(screen.getByText("assessment.cancelledSimulationNotice"))
      .toBeTruthy();

    expect(screen.getByText("assessment.simulationWithCancelledItemAvailable"))
      .toBeTruthy();
  });

  it("keeps an incomplete assessment consultation-only", () => {
    render(<>
      <AssessmentConsultationNotice canPractice={false} canSimulate={false} hasCancelledQuestions />
      <AssessmentTrainingAvailability
        assessment={{...completeCancelledAssessment, canPractice: false, canSimulate: false, readinessReason: "review"}}
      />
    </>);

    expect(screen.getAllByText("assessment.consultationOnlyNotice"))
      .toHaveLength(2);
  });

  it("does not claim a complete simulation when only question practice is available", () => {
    render(<AssessmentConsultationNotice canPractice hasCancelledQuestions />);

    expect(screen.getByText("assessment.cancelledPracticeNotice")).toBeTruthy();
  });
});
