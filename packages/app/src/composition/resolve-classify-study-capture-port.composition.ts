import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveClassifyStudyCapturePort(
  container: Container,
): ApplicationPorts["classifyStudyCapture"] {
  return resolvePort<ApplicationPorts["classifyStudyCapture"]>(
    container,
    applicationDependencyTokens.classifyStudyCapture,
  );
}
