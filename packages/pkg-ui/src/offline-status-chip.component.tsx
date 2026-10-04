import { Chip as MuiChip } from "@mui/material";
import { UIOfflineBoltIcon } from "./offline-bolt-icon.component";
import type { UIOfflineStatusChipProps } from "./offline-status-chip-props.interface";
import type { ReactElement } from "react";

export function UIOfflineStatusChip(props: UIOfflineStatusChipProps): ReactElement {
  return (
    <MuiChip
      icon={<UIOfflineBoltIcon />}
      label={props.label}
      role="status"
      size="small"
      sx={{
        "& .MuiChip-icon": { color: "common.white" },
        backgroundColor: "rgba(255, 255, 255, 0.16)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        color: "common.white",
      }}
    />
  );
}
