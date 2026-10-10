import type { HandleOfflineStudyAssetsDownloadFailureInput } from "./handle-offline-study-assets-download-failure-input.interface";

export function handleOfflineStudyAssetsDownloadFailure(input: HandleOfflineStudyAssetsDownloadFailureInput): void {
  if (input.signal.aborted) {
    return;
  }

  let errorMessage = "Não foi possível preparar os arquivos offline.";

  if (input.error instanceof Error) {
    errorMessage = input.error.message;
  }

  input.setState((current) => {
    return {
      ...current,
      error: errorMessage,
      status: "error",
    };
  });
}
