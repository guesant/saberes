// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OfflineStudyAssetsDownloadNotice } from "./offline-study-assets-download-notice.component";

const offlineDownload = vi.hoisted(() => {
  return {
    retry: vi.fn(),
    state: {
      completedAssets: 0,
      completedBytes: 0,
      failedAssets: 0,
      quotaExceeded: false,
      totalAssets: 1,
      totalBytes: 1024,
      error: null as string | null,
      status: "downloading",
    },
  };
});

vi.mock("./use-offline-study-assets-download.hook", () => {
  return {
    useOfflineStudyAssetsDownload: () => {
      return offlineDownload;
    },
  };
});

describe("aviso de preparação offline", () => {
  beforeEach(() => {
    window.sessionStorage.clear();

    offlineDownload.state.status = "downloading";

    offlineDownload.state.error = null;
  });

  afterEach(() => {
    cleanup();
  });

  it("não reaparece quando o shell é remontado na mesma sessão", () => {
    const firstRender = render(<OfflineStudyAssetsDownloadNotice />);

    expect(screen.getByText("Preparação offline"))
      .toBeTruthy();

    firstRender.unmount();

    render(<OfflineStudyAssetsDownloadNotice />);

    expect(screen.queryByText("Preparação offline"))
      .toBeNull();
  });

  it("volta a exibir uma falha de download após remontar o shell", async () => {
    const firstRender = render(<OfflineStudyAssetsDownloadNotice />);

    firstRender.unmount();

    offlineDownload.state.status = "error";

    offlineDownload.state.error = "Falha de rede";

    render(<OfflineStudyAssetsDownloadNotice />);

    expect(await screen.findByText("Falha de rede"))
      .toBeTruthy();
  });
});
