import { UIButton } from "@guesant/saberes-ui";
import type { OfflineStudyDownloadRetryButtonProps } from "./offline-study-download-retry-button-props.interface";
import type { ReactElement } from "react";

export function OfflineStudyDownloadRetryButton(props: OfflineStudyDownloadRetryButtonProps): ReactElement | null {
  if (!props.visible) {
    return null;
  }

  return (
    <UIButton onClick={props.onRetry} size="small">
      Tentar novamente
    </UIButton>
  );
}
