import {
  CardContent as MuiCardContent,
  type CardContentProps as MuiCardContentProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type UICardContentProps = MuiCardContentProps;

export function UICardContent(props: UICardContentProps): ReactElement {
  return <MuiCardContent {...props} />;
}
