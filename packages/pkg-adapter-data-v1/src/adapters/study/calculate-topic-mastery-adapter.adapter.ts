import { calculateTopicMastery } from "@guesant/saberes-domain";
import type { CalculateTopicMasteryPort } from "@guesant/saberes-application";

export class CalculateTopicMasteryAdapter implements CalculateTopicMasteryPort {
  public execute(
    input: Parameters<CalculateTopicMasteryPort["execute"]>[0],
  ): ReturnType<CalculateTopicMasteryPort["execute"]> {
    return calculateTopicMastery(input);
  }
}
