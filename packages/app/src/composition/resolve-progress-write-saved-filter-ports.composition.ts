import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveProgressWriteSavedFilterPorts(
  container: Container,
): Pick<ApplicationPorts, "saveSavedCatalogFilter" | "deleteSavedCatalogFilter"> {
  return {
    saveSavedCatalogFilter: resolvePort(
      container,
      applicationDependencyTokens.saveSavedCatalogFilter,
    ),
    deleteSavedCatalogFilter: resolvePort(
      container,
      applicationDependencyTokens.deleteSavedCatalogFilter,
    ),
  };
}
