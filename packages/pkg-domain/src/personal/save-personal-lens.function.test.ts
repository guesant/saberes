import { describe, expect, it } from "vitest";
import { savePersonalLens } from "./save-personal-lens.function";
import type { PersonalLens } from "../models/personal-lens.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

const workspace: PersonalWorkspace = {
  activities: [],
  captures: [],
  checklists: [],
  lenses: [
    {
      createdAt: "2026-10-05T00:00:00.000Z",
      id: "lens-1",
      name: "Árvore",
      recordTypes: ["capture"],
      updatedAt: "2026-10-05T00:00:00.000Z",
      view: "tree",
    },
  ],
  notes: [],
  references: [],
};

const updatedLens: PersonalLens = {
  createdAt: "2026-10-05T00:00:00.000Z",
  id: "lens-1",
  name: "Board",
  recordTypes: ["note"],
  updatedAt: "2026-10-05T00:01:00.000Z",
  view: "board",
};

describe("savePersonalLens", () => {
  it("updates an existing lens without duplicating it", () => {
    const nextWorkspace = savePersonalLens({ lens: updatedLens, workspace });

    expect(nextWorkspace.lenses)
      .toEqual([updatedLens]);
  });

  it("adds a new lens to the local workspace", () => {
    const nextWorkspace = savePersonalLens({
      lens: { ...updatedLens, id: "lens-2" },
      workspace,
    });

    expect(nextWorkspace.lenses)
      .toHaveLength(2);
  });
});
