import { useCallback, useEffect, useRef, useState } from "react";
import { runOfflineStudyAssetsDownload } from "../run-offline-study-assets-download.function";
import type { OfflineStudyDownloadState } from "../offline-study-download-state.interface";

const INITIAL_DOWNLOAD_STATE: OfflineStudyDownloadState = {
  completedAssets: 0,
  completedBytes: 0,
  failedAssets: 0,
  quotaExceeded: false,
  totalAssets: 0,
  totalBytes: 0,
  error: null,
  status: "preparing",
};

export function useOfflineStudyAssetsDownload() {
  const controllerRef = useRef<AbortController | null>(null);

  const [state, setState] = useState(INITIAL_DOWNLOAD_STATE);

  const pause = useCallback(() => {
    controllerRef.current?.abort();

    setState((current) => {return { ...current, status: "offline" };});
  }, []);

  const start = useCallback(() => {
    if (!navigator.onLine) {
      setState((current) => {return { ...current, status: "offline" };});

      return Promise.resolve();
    }

    controllerRef.current?.abort();

    const controller = new AbortController();

    controllerRef.current = controller;

    return runOfflineStudyAssetsDownload({ controller, setState });
  }, []);

  useEffect(() => {
    const resume = () => { start(); };

    window.addEventListener("offline", pause);

    window.addEventListener("online", resume);

    start();

    return () => {
      window.removeEventListener("offline", pause);

      window.removeEventListener("online", resume);

      controllerRef.current?.abort();
    };
  }, [start]);

  return { retry: start, state };
}
