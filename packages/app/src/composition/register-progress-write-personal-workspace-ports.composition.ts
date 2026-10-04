import {
  SavePersonalWorkspaceAdapter,
  type ProgressStorageContract,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPortFactories } from "./register-port-factories.composition";
import { resolvePort } from "./resolve-port.composition";
import type { Container } from "inversify";

export function registerProgressWritePersonalWorkspacePorts(container: Container): void {
  registerPortFactories(container, [
    [
      applicationDependencyTokens.savePersonalWorkspace,
      () =>
        new SavePersonalWorkspaceAdapter(
          resolvePort<ProgressStorageContract>(
            container,
            applicationDependencyTokens.progressStore,
          ),
        ),
    ],
  ]);
}
