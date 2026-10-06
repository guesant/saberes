import { loadContentDatabase, SqlJsContentRepository } from "@guesant/saberes-adapter-data-v1";
import { GraphologyBuildKnowledgeGraphAdapter } from "@guesant/saberes-adapter-graphology-v1";
import {
  ValibotParseEditorialBlocksAdapter,
  ValidateContentSnapshotAdapter,
} from "@guesant/saberes-adapter-validation-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerContentCorePortBindings } from "./register-content-core-port-bindings.composition";
import { registerContentGraphPortBindings } from "./register-content-graph-port-bindings.composition";
import { registerPort } from "./register-port.composition";
import { resolvePort } from "./resolve-port.composition";
import type { ContentDatabaseProviderContract } from "@guesant/saberes-adapter-data-v1";
import type { Container } from "inversify";

export function createContentDependencies(container: Container): void {
  registerPort(container, applicationDependencyTokens.contentDatabaseProvider, () => {
    return { execute: loadContentDatabase };
  });

  registerPort(container, applicationDependencyTokens.contentRepository, () => {
    return new SqlJsContentRepository(resolvePort<ContentDatabaseProviderContract>(
      container, applicationDependencyTokens.contentDatabaseProvider,
    ));
  });

  registerContentCorePortBindings(container);

  registerContentGraphPortBindings(container);

  registerPort(container, applicationDependencyTokens.parseEditorialBlocks, () => {
    return new ValibotParseEditorialBlocksAdapter();
  });

  registerPort(container, applicationDependencyTokens.buildKnowledgeGraph, () => {
    return new GraphologyBuildKnowledgeGraphAdapter();
  });

  registerPort(container, applicationDependencyTokens.validateContentSnapshot, () => {
    return new ValidateContentSnapshotAdapter();
  });
}
