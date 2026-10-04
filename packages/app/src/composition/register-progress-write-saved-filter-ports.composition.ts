import {
  type ProgressStorageContract,
  DeleteSavedCatalogFilterAdapter,
  SaveSavedCatalogFilterAdapter,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPortFactories } from "./register-port-factories.composition";
import { resolvePort } from "./resolve-port.composition";
import type { Container } from "inversify";

export function createProgressWriteSavedFilterPortBindings(container: Container): void {
  const getProgressStore = (): ProgressStorageContract =>
    resolvePort<ProgressStorageContract>(container, applicationDependencyTokens.progressStore);

  const bindings: Array<readonly [symbol, () => object]> = [
    [
      applicationDependencyTokens.saveSavedCatalogFilter,
      () => new SaveSavedCatalogFilterAdapter(getProgressStore()),
    ],
    [
      applicationDependencyTokens.deleteSavedCatalogFilter,
      () => new DeleteSavedCatalogFilterAdapter(getProgressStore()),
    ],
  ];

  registerPortFactories(container, bindings);
}
