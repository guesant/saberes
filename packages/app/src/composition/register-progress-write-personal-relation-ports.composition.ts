import {
  ArchivePersonalRelationAdapter,
  CreatePersonalRelationAdapter,
  RestorePersonalRelationAdapter,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { createProgressStorageAdapterFactory } from "./create-progress-storage-adapter-factory.composition";
import { registerPortFactories } from "./register-port-factories.composition";
import type { Container } from "inversify";

export function registerProgressWritePersonalRelationPorts(container: Container): void {
  registerPortFactories(container, [
    [
      applicationDependencyTokens.archivePersonalRelation,
      createProgressStorageAdapterFactory(container, ArchivePersonalRelationAdapter),
    ],
    [
      applicationDependencyTokens.createPersonalRelation,
      createProgressStorageAdapterFactory(container, CreatePersonalRelationAdapter),
    ],
    [
      applicationDependencyTokens.restorePersonalRelation,
      createProgressStorageAdapterFactory(container, RestorePersonalRelationAdapter),
    ],
  ]);
}
