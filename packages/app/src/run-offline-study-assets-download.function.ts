import { completeOfflineStudyAssetsDownload } from "./complete-offline-study-assets-download.function";
import { downloadOfficialStudyAssets } from "./download-official-study-assets.function";
import { handleOfflineStudyAssetsDownloadFailure } from "./handle-offline-study-assets-download-failure.function";
import type { RunOfflineStudyAssetsDownloadInput } from "./run-offline-study-assets-download-input.interface";

export async function runOfflineStudyAssetsDownload(input: RunOfflineStudyAssetsDownloadInput): Promise<void> {
  const { controller, setState } = input;

  const { signal } = controller;

  setState((current) => {return { ...current, error: null, status: "preparing" };});

  try {
    const progress = await downloadOfficialStudyAssets(signal, (nextProgress) => {
      if (!signal.aborted) {
        setState({ ...nextProgress, error: null, status: "downloading" });
      }
    });

    completeOfflineStudyAssetsDownload({ progress, setState, signal });
  } catch (error) {
    handleOfflineStudyAssetsDownloadFailure({ error, setState, signal });
  }
}
