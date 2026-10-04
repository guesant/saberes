import { Container } from "inversify";
import { createContentDependencies } from "./create-content-dependencies.composition";
import { createProgressReadDependencies } from "./create-progress-read-dependencies.composition";
import { createProgressWriteDependencies } from "./create-progress-write-dependencies.composition";
import { createStudyDependencies } from "./create-study-dependencies.composition";
import { resolveApplicationPorts } from "./resolve-application-ports.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";

export function createAppDependencies(): ApplicationPorts {
  const container = new Container();

  createContentDependencies(container);

  createProgressReadDependencies(container);

  createProgressWriteDependencies(container);

  createStudyDependencies(container);

  return resolveApplicationPorts(container);
}
