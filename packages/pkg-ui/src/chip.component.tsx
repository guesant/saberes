import { Chip as MuiChip, type ChipProps as MuiChipProps } from "@mui/material";
import type { ReactElement } from "react";

export type ChipProps = MuiChipProps;

export function Chip(props: ChipProps): ReactElement {
  return <MuiChip {...props} />;
}
