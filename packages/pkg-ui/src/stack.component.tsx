import { Box as MuiBox, type BoxProps as MuiBoxProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIStackProps = MuiBoxProps;

export function UIStack(props: UIStackProps): ReactElement {
  return <MuiBox {...props} data-ui-layout="stack" display="flex" flexDirection="column" />;
}
