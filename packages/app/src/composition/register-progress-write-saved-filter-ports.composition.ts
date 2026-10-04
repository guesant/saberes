import {
  type ProgressStorageContract,
  DeleteSavedCatalogFilterAdapter,
  SaveSavedCatalogFilterAdapter,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPortFactories } from "./register-port-factories.composition";
import { resolvePort } from "./resolve-port.composition";
import type { PortFactoryBinding } from "./port-factory-binding.type";
import type { Container } from "inversify";

export function createProgressWriteSavedFilterPortBindings(container: Container): void {
  const getProgressStore = (): ProgressStorageContract => {
    return resolvePort<ProgressStorageContract>(
      container,
      applicationDependencyTokens.progressStore,
    );
  };

  const bindings: PortFactoryBinding[] = [
    [
      applicationDependencyTokens.saveSavedCatalogFilter,
      () => {
        return new SaveSavedCatalogFilterAdapter(getProgressStore());
      },
    ],
    [
      applicationDependencyTokens.deleteSavedCatalogFilter,
      () => {
        return new DeleteSavedCatalogFilterAdapter(getProgressStore());
      },
    ],
  ];

  registerPortFactories(container, bindings);
}
