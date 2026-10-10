import type { OfflineStudyAsset } from "./offline-study-asset.interface";
import type { OfflineStudyDownloadProgress } from "./offline-study-download-progress.interface";

export interface DownloadOfficialStudyAssetsSequentiallyInput {
  assets: OfflineStudyAsset[];
  cache: Cache;
  onProgress(progress: OfflineStudyDownloadProgress): void;
  progress: OfflineStudyDownloadProgress;
  signal: AbortSignal;
  startIndex: number;
}
