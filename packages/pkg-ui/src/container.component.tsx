import { Container as MuiContainer, type ContainerProps as MuiContainerProps } from "@mui/material";
import type { ReactElement } from "react";

export type ContainerProps = MuiContainerProps;

export function Container(props: ContainerProps): ReactElement {
  return <MuiContainer {...props} />;
}
