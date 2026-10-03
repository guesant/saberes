import { Link as MuiLink, type LinkProps as MuiLinkProps } from "@mui/material";
import type { ReactElement } from "react";

export type LinkProps = MuiLinkProps;

export function Link(props: LinkProps): ReactElement {
  return <MuiLink {...props} />;
}
