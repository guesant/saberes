import {
  ListAcademicDisciplinesAdapter,
  type ProgressStorageContract,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPortFactories } from "./register-port-factories.composition";
import { resolvePort } from "./resolve-port.composition";
import type { Container } from "inversify";

export function registerProgressReadAcademicPorts(container: Container): void {
  registerPortFactories(container, [
    [
      applicationDependencyTokens.listAcademicDisciplines,
      () => {
        return new ListAcademicDisciplinesAdapter(
          resolvePort<ProgressStorageContract>(
            container,
            applicationDependencyTokens.progressStore,
          ),
        );
      },
    ],
  ]);
}
