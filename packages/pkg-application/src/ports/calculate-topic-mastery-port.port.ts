import type { Attempt } from "../models/progress.models.ts";

export interface CalculateTopicMasteryPort {
  execute(attempts?: Attempt[]): Record<string, Record<string, unknown>>;
}
