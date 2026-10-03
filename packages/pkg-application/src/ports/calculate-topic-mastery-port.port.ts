import type { Attempt } from "../models/index.ts";

export interface CalculateTopicMasteryPort {
  execute(attempts?: Attempt[]): Record<string, Record<string, unknown>>;
}
