import { describe, expect, it } from "vitest";
import { calculatePersonalLensComparison } from "./calculate-personal-lens-comparison.function";
import type { PersonalLens } from "../models/personal-lens.interface";

const currentLens: PersonalLens = {
  createdAt: "2026-10-05T00:00:00.000Z",
  id: "lens-1",
  name: "Árvore",
  recordTypes: ["capture"],
  updatedAt: "2026-10-05T00:00:00.000Z",
  view: "tree",
};

describe("calculatePersonalLensComparison", () => {
  it("exposes changed view and record types without persisting a scenario", () => {
    const comparison = calculatePersonalLensComparison({
      candidateLens: {
        ...currentLens,
        name: "Board",
        recordTypes: ["note"],
        view: "board",
      },
      currentLens,
    });

    expect(comparison)
      .toEqual({
        candidateView: "board",
        changedRecordTypes: ["note"],
        changedView: true,
        currentView: "tree",
        sameName: false,
      });
  });
});
