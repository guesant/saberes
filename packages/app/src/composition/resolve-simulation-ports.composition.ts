import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveSimulationPorts(container: Container): ApplicationPorts["simulation"] {
  return {
    updateSimulationSession: resolvePort<ApplicationPorts["simulation"]["updateSimulationSession"]>(
      container,
      applicationDependencyTokens.updateSimulationSession,
    ),
    completeSimulationSession: resolvePort<ApplicationPorts["simulation"]["completeSimulationSession"]>(
      container,
      applicationDependencyTokens.completeSimulationSession,
    ),
  };
}
