import { SqlJsContentRepository } from "@guesant/saberes-adapter-data-v1";
import { GraphologyBuildKnowledgeGraphAdapter } from "@guesant/saberes-adapter-graphology-v1";
import { ValibotParseEditorialBlocksAdapter } from "@guesant/saberes-adapter-validation-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerContentCorePortBindings } from "./register-content-core-port-bindings.composition";
import { registerContentGraphPortBindings } from "./register-content-graph-port-bindings.composition";
import { registerPort } from "./register-port.composition";
import type { Container } from "inversify";

export function createContentDependencies(container: Container): void {
  registerPort(
    container,
    applicationDependencyTokens.contentRepository,
    () => new SqlJsContentRepository(),
  );

  registerContentCorePortBindings(container);

  registerContentGraphPortBindings(container);

  registerPort(
    container,
    applicationDependencyTokens.parseEditorialBlocks,
    () => new ValibotParseEditorialBlocksAdapter(),
  );

  registerPort(
    container,
    applicationDependencyTokens.buildKnowledgeGraph,
    () => new GraphologyBuildKnowledgeGraphAdapter(),
  );
}
