import {
  CardContent as MuiCardContent,
  type CardContentProps as MuiCardContentProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type CardContentProps = MuiCardContentProps;

export function CardContent(props: CardContentProps): ReactElement {
  return <MuiCardContent {...props} />;
}
