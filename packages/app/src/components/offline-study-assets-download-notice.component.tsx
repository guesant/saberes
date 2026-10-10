import {
  UIContentGroup,
  UIToast,
  UITypography,
} from "@guesant/saberes-ui";
import { useState } from "react";
import { getOfflineStudyDownloadAutoHideDuration } from "../get-offline-study-download-auto-hide-duration.function";
import { getOfflineStudyDownloadMessage } from "../get-offline-study-download-message.function";
import { getOfflineStudyDownloadProgressValue } from "../get-offline-study-download-progress-value.function";
import { getOfflineStudyDownloadSeverity } from "../get-offline-study-download-severity.function";
import { OfflineStudyDownloadProgressBar } from "../offline-study-download-progress-bar.component";
import { OfflineStudyDownloadRetryButton } from "../offline-study-download-retry-button.component";
import { useOfflineStudyAssetsDownload } from "./use-offline-study-assets-download.hook";
import type { ReactElement } from "react";

export function OfflineStudyAssetsDownloadNotice(): ReactElement {
  const { retry, state } = useOfflineStudyAssetsDownload();

  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => { setDismissed(true); };

  const handleRetry = () => {
    setDismissed(false);

    retry();
  };

  return (
    <UIToast
      autoHideDuration={getOfflineStudyDownloadAutoHideDuration(state)}
      onClose={handleDismiss}
      open={!dismissed}
      severity={getOfflineStudyDownloadSeverity(state)}
    >
      <UIContentGroup variant="content">
        <UITypography variant="subtitle2">Preparação offline</UITypography>
        <UITypography variant="body2">{getOfflineStudyDownloadMessage(state)}</UITypography>
        <OfflineStudyDownloadProgressBar value={getOfflineStudyDownloadProgressValue(state)} />
        <OfflineStudyDownloadRetryButton onRetry={handleRetry} visible={state.status === "error"} />
      </UIContentGroup>
    </UIToast>
  );
}
