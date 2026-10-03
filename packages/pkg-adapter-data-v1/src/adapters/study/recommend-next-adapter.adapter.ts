import { recommendNext } from "@guesant/saberes-domain";
import type { RecommendNextPort } from "@guesant/saberes-application";

export class RecommendNextAdapter implements RecommendNextPort {
  public execute(
    input: Parameters<RecommendNextPort["execute"]>[0],
  ): ReturnType<RecommendNextPort["execute"]> {
    return recommendNext(input);
  }
}
