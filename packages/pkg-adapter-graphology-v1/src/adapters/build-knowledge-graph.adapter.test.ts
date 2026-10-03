import { describe, expect, it } from "vitest";
import { GraphologyBuildKnowledgeGraphAdapter } from "./build-knowledge-graph.adapter";

describe("GraphologyBuildKnowledgeGraphAdapter", () => {
  it("builds a graph and omits orphan edges", async () => {
    const adapter = new GraphologyBuildKnowledgeGraphAdapter();

    const result = await adapter.execute({
      type: "knowledge_map",
      nodes: [
        { id: "intro", label: "Introdução" },
        { id: "practice", label: "Prática" },
      ],
      edges: [
        { source: "intro", target: "practice", relation: "prerequisite" },
        { source: "missing", target: "practice", relation: "prerequisite" },
      ],
    });

    expect(result.edges).toEqual([
      {
        id: "intro->practice",
        source: "intro",
        target: "practice",
        relation: "prerequisite",
      },
    ]);
  });
});
