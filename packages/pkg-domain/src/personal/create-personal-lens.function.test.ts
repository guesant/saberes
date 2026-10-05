import { describe, expect, it } from "vitest";
import { createPersonalKnowledgeProjection } from "./create-personal-knowledge-projection.function";
import { createPersonalLens } from "./create-personal-lens.function";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

const workspace: PersonalWorkspace = {
  activities: [],
  captures: [
    {
      archived: false,
      completed: false,
      createdAt: "2026-10-05T00:00:00.000Z",
      description: "Revisar",
      id: "capture-1",
      priority: "medium",
      title: "Captura",
      updatedAt: "2026-10-05T00:00:00.000Z",
    },
  ],
  checklists: [],
  notes: [],
  references: [],
};

describe("personal lenses", () => {
  it("stores a view over the existing workspace without copying records", () => {
    const nextWorkspace = createPersonalLens({
      id: "lens-1",
      name: "Minha árvore",
      now: "2026-10-05T00:00:00.000Z",
      recordTypes: ["capture"],
      view: "tree",
      workspace,
    });

    expect(nextWorkspace.captures)
      .toBe(workspace.captures);

    expect(nextWorkspace.lenses?.[0].view)
      .toBe("tree");
  });
});

describe("personal knowledge projection", () => {
  it("uses one workspace source for nodes and relations", () => {
    const projection = createPersonalKnowledgeProjection({ workspace });

    expect(projection.nodes.map((node) => {return node.id;}))
      .toEqual(["capture-1"]);

    expect(projection.relations)
      .toEqual([]);
  });
});
