import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveStudySchedulerPorts(
  container: Container,
): Pick<ApplicationPorts, "scheduleReview" | "previewReview"> {
  return {
    scheduleReview: resolvePort(container, applicationDependencyTokens.scheduleReview),
    previewReview: resolvePort(container, applicationDependencyTokens.previewReview),
  };
}
