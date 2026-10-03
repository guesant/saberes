import { Card as MuiCard, type CardProps as MuiCardProps } from "@mui/material";
import type { ReactElement } from "react";

export type CardProps = MuiCardProps;

export function Card(props: CardProps): ReactElement {
  return <MuiCard {...props} />;
}
