import type { RecommendNextPort } from "../application.ports.ts";

export class RecommendNextQueryHandler {
  public constructor(private readonly port: RecommendNextPort) {}

  public execute(input?: Record<string, unknown>): Record<string, unknown> | null {
    return this.port.execute(input);
  }
}
