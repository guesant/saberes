import { resolveContentPorts } from "./resolve-content-ports.composition";
import { resolveProgressReadPorts } from "./resolve-progress-read-ports.composition";
import { resolveProgressWritePorts } from "./resolve-progress-write-ports.composition";
import { resolveStudyPorts } from "./resolve-study-ports.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveApplicationPorts(container: Container): ApplicationPorts {
  return {
    ...resolveContentPorts(container),
    ...resolveProgressReadPorts(container),
    ...resolveProgressWritePorts(container),
    ...resolveStudyPorts(container),
  };
}
