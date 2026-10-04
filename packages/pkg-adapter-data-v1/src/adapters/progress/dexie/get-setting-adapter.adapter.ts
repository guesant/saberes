import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { GetSettingPort } from "@guesant/saberes-application";

export class GetSettingAdapter implements GetSettingPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(
    input: Parameters<GetSettingPort["execute"]>[0],
  ): ReturnType<GetSettingPort["execute"]> {
    return this.store.getSetting(input);
  }
}
