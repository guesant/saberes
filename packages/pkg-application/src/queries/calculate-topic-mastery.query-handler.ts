import type { Attempt } from "../models/index";
import type { CalculateTopicMasteryPort } from "../ports/index";

export class CalculateTopicMasteryQueryHandler {
  public constructor(private readonly port: CalculateTopicMasteryPort) {}

  public execute(attempts?: Attempt[]): Record<string, Record<string, unknown>> {
    return this.port.execute(attempts);
  }
}
