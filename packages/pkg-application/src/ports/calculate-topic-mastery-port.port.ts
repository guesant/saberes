import type { Attempt } from "../models/index";

export interface CalculateTopicMasteryPort {
  execute(attempts?: Attempt[]): Record<string, Record<string, unknown>>;
}
