import { UILinearProgress } from "@guesant/saberes-ui";
import type { OfflineStudyDownloadProgressBarProps } from "./offline-study-download-progress-bar-props.interface";
import type { ReactElement } from "react";

export function OfflineStudyDownloadProgressBar(props: OfflineStudyDownloadProgressBarProps): ReactElement | null {
  if (props.value === null) {
    return null;
  }

  return (
    <UILinearProgress
      aria-label="Progresso do download offline"
      value={props.value}
      variant="determinate"
    />
  );
}
