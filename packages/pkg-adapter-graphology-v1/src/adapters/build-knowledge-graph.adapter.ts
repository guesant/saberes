import Graph from "graphology";
import type { BuildKnowledgeGraphPort } from "@guesant/saberes-application";
import type { KnowledgeGraph, KnowledgeMapBlock } from "@guesant/saberes-domain";

export class GraphologyBuildKnowledgeGraphAdapter implements BuildKnowledgeGraphPort {
  public async execute(block: KnowledgeMapBlock): Promise<KnowledgeGraph> {
    const graph = new Graph({ type: "directed", multi: true });

    block.nodes.forEach((node) => {
      graph.addNode(node.id, node);
    });

    const edges = block.edges.flatMap((edge) => {
      if (!graph.hasNode(edge.source) || !graph.hasNode(edge.target)) {
        return [];
      }

      const id = `${edge.source}->${edge.target}`;

      graph.addDirectedEdgeWithKey(id, edge.source, edge.target, edge);

      return [{ ...edge, id }];
    });

    return { nodes: block.nodes, edges };
  }
}
