import { resolveProgressWriteAdditionalPorts } from "./resolve-progress-write-additional-ports.composition";
import { resolveProgressWriteCorePorts } from "./resolve-progress-write-core-ports.composition";
import { resolveProgressWriteReviewPorts } from "./resolve-progress-write-review-ports.composition";
import { resolveProgressWriteSavedFilterPorts } from "./resolve-progress-write-saved-filter-ports.composition";
import type { ProgressWritePorts } from "./progress-write-ports.type";
import type { Container } from "inversify";

export function resolveProgressWritePorts(container: Container): ProgressWritePorts {
  return {
    ...resolveProgressWriteAdditionalPorts(container),
    ...resolveProgressWriteCorePorts(container),
    ...resolveProgressWriteReviewPorts(container),
    ...resolveProgressWriteSavedFilterPorts(container),
  };
}
