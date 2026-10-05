import { Card as MuiCard } from "@mui/material";
import type { CardProps as MuiCardProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIFullHeightCardProps = MuiCardProps;

export function UIFullHeightCard(props: UIFullHeightCardProps): ReactElement {
  return <MuiCard {...props} data-ui-layout="stack" sx={{ height: "100%", ...props.sx }} />;
}
