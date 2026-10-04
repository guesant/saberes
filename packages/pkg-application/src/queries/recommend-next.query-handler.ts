import type { RecommendNextPort } from "../ports/index";
import type { RecommendationInput, RecommendationItem } from "@guesant/saberes-domain";

export class RecommendNextQueryHandler {
  public constructor(private readonly port: RecommendNextPort) {}

  public execute(input?: RecommendationInput): RecommendationItem | null {
    return this.port.execute(input);
  }
}
