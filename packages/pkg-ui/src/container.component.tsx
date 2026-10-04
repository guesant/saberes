import { Container as MuiContainer, type ContainerProps as MuiContainerProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIContainerProps = MuiContainerProps;

export function UIContainer(props: UIContainerProps): ReactElement {
  return <MuiContainer {...props} />;
}
