import type { CalculateTopicMasteryPort } from "../application.ports.ts";
import type { Attempt } from "../models/progress.models.ts";

export class CalculateTopicMasteryQueryHandler {
  public constructor(private readonly port: CalculateTopicMasteryPort) {}

  public execute(attempts?: Attempt[]): Record<string, Record<string, unknown>> {
    return this.port.execute(attempts);
  }
}
