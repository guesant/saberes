const NOTICE_SEEN_SESSION_KEY = "saberes:offline-study-assets-notice-seen";

export function recordOfflineStudyAssetsDownloadNotice(): boolean {
  try {
    const storage = window.sessionStorage;

    if (storage.getItem(NOTICE_SEEN_SESSION_KEY) === "true") {
      return false;
    }

    storage.setItem(NOTICE_SEEN_SESSION_KEY, "true");

    return true;
  } catch {
    return true;
  }
}
