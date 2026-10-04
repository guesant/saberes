import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { GetSessionPort } from "@guesant/saberes-application";

export class GetSessionAdapter implements GetSessionPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(
    input: Parameters<GetSessionPort["execute"]>[0],
  ): ReturnType<GetSessionPort["execute"]> {
    return this.store.getSession(input);
  }
}
