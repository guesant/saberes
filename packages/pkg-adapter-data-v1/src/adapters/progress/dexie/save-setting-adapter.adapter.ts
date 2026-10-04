import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { SaveSettingPort } from "@guesant/saberes-application";

export class SaveSettingAdapter implements SaveSettingPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public async execute(input: Parameters<SaveSettingPort["execute"]>[0]): Promise<void> {
    await this.store.saveSetting(input.key, input.value);
  }
}
