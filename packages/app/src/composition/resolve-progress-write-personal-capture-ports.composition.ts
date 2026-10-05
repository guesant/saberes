import { resolveApplicationPort } from "./resolve-application-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveProgressWritePersonalCapturePorts(
  container: Container,
): Pick<
  ApplicationPorts,
  | "classifyStudyCapture"
  | "completeStudyCapture"
  | "postponeStudyCapture"
  | "archiveStudyCapture"
  | "restoreStudyCapture"
  | "undoStudyCapture"
> {
  return {
    classifyStudyCapture: resolveApplicationPort(container, "classifyStudyCapture"),
    completeStudyCapture: resolveApplicationPort(container, "completeStudyCapture"),
    postponeStudyCapture: resolveApplicationPort(container, "postponeStudyCapture"),
    archiveStudyCapture: resolveApplicationPort(container, "archiveStudyCapture"),
    restoreStudyCapture: resolveApplicationPort(container, "restoreStudyCapture"),
    undoStudyCapture: resolveApplicationPort(container, "undoStudyCapture"),
  };
}
