import { describe, expect, it } from "vitest";
import { getOfflineStudyDownloadAutoHideDuration } from "./get-offline-study-download-auto-hide-duration.function";

describe("duração do aviso de preparação offline", () => {
  const progress = {
    completedAssets: 0,
    completedBytes: 0,
    failedAssets: 0,
    quotaExceeded: false,
    totalAssets: 1,
    totalBytes: 1024,
    error: null,
  };

  it("fecha avisos de progresso após oito segundos", () => {
    expect(getOfflineStudyDownloadAutoHideDuration({ ...progress, status: "preparing" }))
      .toBe(
        8000,
      );

    expect(getOfflineStudyDownloadAutoHideDuration({ ...progress, status: "downloading" }))
      .toBe(
        8000,
      );

    expect(getOfflineStudyDownloadAutoHideDuration({ ...progress, status: "complete" }))
      .toBe(8000);
  });

  it("mantém os erros abertos para permitir uma nova tentativa", () => {
    expect(getOfflineStudyDownloadAutoHideDuration({ ...progress, status: "error" }))
      .toBeNull();
  });
});
