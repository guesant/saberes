import { downloadOneOfficialStudyAsset } from "./download-one-official-study-asset.function";
import { recordOfficialStudyAssetDownloadResult } from "./record-official-study-asset-download-result.function";
import type { DownloadOfficialStudyAssetsSequentiallyInput } from "./download-official-study-assets-sequentially-input.interface";

export function downloadOfficialStudyAssetsSequentially(
  input: DownloadOfficialStudyAssetsSequentiallyInput,
): Promise<void> {
  const asset = input.assets[input.startIndex];

  if (!asset || input.signal.aborted || input.progress.quotaExceeded) {
    return Promise.resolve();
  }

  return downloadOneOfficialStudyAsset({ asset, cache: input.cache, signal: input.signal })
    .then((result) => {
      recordOfficialStudyAssetDownloadResult(result, input);

      return downloadOfficialStudyAssetsSequentially({ ...input, startIndex: input.startIndex + 2 });
    });
}
