import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import type { ProgressStorageAdapterConstructor } from "./progress-storage-adapter-constructor.type";
import type { ProgressStorageAdapterFactory } from "./progress-storage-adapter-factory.type";
import type { ProgressStorageContract } from "@guesant/saberes-adapter-data-v1";
import type { Container } from "inversify";

export function createProgressStorageAdapterFactory<TAdapter>(
  container: Container,
  Adapter: ProgressStorageAdapterConstructor<TAdapter>,
): ProgressStorageAdapterFactory<TAdapter> {
  return () => {
    return new Adapter(
      resolvePort<ProgressStorageContract>(container, applicationDependencyTokens.progressStore),
    );
  };
}
