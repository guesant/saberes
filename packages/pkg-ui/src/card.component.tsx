import { Card as MuiCard, type CardProps as MuiCardProps } from "@mui/material";
import type { ReactElement } from "react";

export type UICardProps = MuiCardProps;

export function UICard(props: UICardProps): ReactElement {
  return <MuiCard {...props} />;
}
