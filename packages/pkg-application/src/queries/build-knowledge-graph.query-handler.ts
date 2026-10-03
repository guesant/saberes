import type { BuildKnowledgeGraphPort } from "../ports/build-knowledge-graph-port.port.ts";
import type { KnowledgeGraph, KnowledgeMapBlock } from "@guesant/saberes-domain";

export class BuildKnowledgeGraphQueryHandler {
  public constructor(private readonly port: BuildKnowledgeGraphPort) {}

  public execute(block: KnowledgeMapBlock): Promise<KnowledgeGraph> {
    return this.port.execute(block);
  }
}
