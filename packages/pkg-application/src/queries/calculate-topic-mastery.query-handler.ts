import type { Attempt } from "../models/index.ts";
import type { CalculateTopicMasteryPort } from "../ports/index.ts";

export class CalculateTopicMasteryQueryHandler {
  public constructor(private readonly port: CalculateTopicMasteryPort) {}

  public execute(attempts?: Attempt[]): Record<string, Record<string, unknown>> {
    return this.port.execute(attempts);
  }
}
