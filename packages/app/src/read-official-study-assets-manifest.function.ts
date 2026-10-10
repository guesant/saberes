import { getOfficialStudyAssetUrl } from "./get-official-study-asset-url.function";
import type { OfflineStudyAsset } from "./offline-study-asset.interface";

export async function readOfficialStudyAssetsManifest(signal: AbortSignal): Promise<OfflineStudyAsset[]> {
  const response = await fetch(getOfficialStudyAssetUrl("data/asset-manifest.jsonl"), { signal });

  if (!response.ok) {
    throw new Error("Não foi possível carregar a lista de PDFs locais.");
  }

  const manifest = await response.text();

  return manifest.split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as OfflineStudyAsset)
    .filter((asset) => asset.mediaType === "application/pdf" && asset.bytes > 0 && asset.appUrlSuffix.startsWith("data/"))
    .sort((left, right) => {
      const leftYear = /20\d{2}/u.exec(left.path);
      const rightYear = /20\d{2}/u.exec(right.path);

      return Number(rightYear?.[0] ?? 0) - Number(leftYear?.[0] ?? 0);
    });
}
