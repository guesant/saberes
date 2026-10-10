import type { OfflineStudyAsset } from "./offline-study-asset.interface";

export interface DownloadOneOfficialStudyAssetInput {
  asset: OfflineStudyAsset;
  cache: Cache;
  signal: AbortSignal;
}
