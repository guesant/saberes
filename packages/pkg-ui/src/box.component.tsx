import { Box as MuiBox, type BoxProps as MuiBoxProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIBoxProps = MuiBoxProps & {
  alt?: string;
  src?: string;
};

export function UIBox(props: UIBoxProps): ReactElement {
  return <MuiBox {...(props as MuiBoxProps)} />;
}
