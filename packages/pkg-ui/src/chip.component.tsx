import { Chip as MuiChip, type ChipProps as MuiChipProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIChipProps = MuiChipProps;

export function UIChip(props: UIChipProps): ReactElement {
  return <MuiChip {...props} />;
}
