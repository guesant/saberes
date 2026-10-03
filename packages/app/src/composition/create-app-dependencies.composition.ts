import { DexieProgressStore } from "@guesant/saberes-adapter-data-v1";
import { createContentDependencies } from "./create-content-dependencies.composition";
import { createProgressReadDependencies } from "./create-progress-read-dependencies.composition";
import { createProgressWriteDependencies } from "./create-progress-write-dependencies.composition";
import { createStudyDependencies } from "./create-study-dependencies.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";

export function createAppDependencies(): ApplicationPorts {
  const progressStore = new DexieProgressStore();

  return {
    ...createContentDependencies(),
    ...createProgressReadDependencies(progressStore),
    ...createProgressWriteDependencies(progressStore),
    ...createStudyDependencies(),
  } as ApplicationPorts;
}
