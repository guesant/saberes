import { Box as MuiBox, type BoxProps as MuiBoxProps } from "@mui/material";
import type { ReactElement } from "react";

export type BoxProps = MuiBoxProps & {
  alt?: string;
  src?: string;
};

export function Box(props: BoxProps): ReactElement {
  return <MuiBox {...(props as MuiBoxProps)} />;
}
