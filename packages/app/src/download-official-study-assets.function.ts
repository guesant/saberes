import { downloadOfficialStudyAssetsSequentially } from "./download-official-study-assets-sequentially.function";
import { OFFICIAL_STUDY_ASSETS_CACHE_NAME } from "./get-official-study-asset-url-pattern.function";
import { readOfficialStudyAssetsManifest } from "./read-official-study-assets-manifest.function";
import type { DownloadOfficialStudyAssetsProgressHandler } from "./download-official-study-assets-progress-handler.interface";
import type { OfflineStudyDownloadProgress } from "./offline-study-download-progress.interface";

export async function downloadOfficialStudyAssets(
  signal: AbortSignal,
  onProgress: DownloadOfficialStudyAssetsProgressHandler,
): Promise<OfflineStudyDownloadProgress> {
  const assets = await readOfficialStudyAssetsManifest(signal);

  if (assets.length === 0) {
    throw new Error("O manifesto não contém PDFs oficiais para baixar.");
  }

  const cache = await caches.open(OFFICIAL_STUDY_ASSETS_CACHE_NAME);

  const progress: OfflineStudyDownloadProgress = {
    completedAssets: 0,
    completedBytes: 0,
    failedAssets: 0,
    quotaExceeded: false,
    totalAssets: assets.length,
    totalBytes: assets.reduce((totalBytes, asset) => {return totalBytes + asset.bytes;}, 0),
  };

  onProgress({ ...progress });

  await Promise.all([
    downloadOfficialStudyAssetsSequentially({ assets, cache, onProgress, progress, signal, startIndex: 0 }),
    downloadOfficialStudyAssetsSequentially({ assets, cache, onProgress, progress, signal, startIndex: 1 }),
  ]);

  return progress;
}
