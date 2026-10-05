import {
  ListCalendarEntriesAdapter,
  GetPersonalWorkspaceAdapter,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { createProgressStorageAdapterFactory } from "./create-progress-storage-adapter-factory.composition";
import { registerPortFactories } from "./register-port-factories.composition";
import type { Container } from "inversify";

export function registerProgressReadPersonalWorkspacePorts(container: Container): void {
  registerPortFactories(container, [
    [
      applicationDependencyTokens.getPersonalWorkspace,
      createProgressStorageAdapterFactory(container, GetPersonalWorkspaceAdapter),
    ],
    [
      applicationDependencyTokens.listCalendarEntries,
      createProgressStorageAdapterFactory(container, ListCalendarEntriesAdapter),
    ],
  ]);
}
