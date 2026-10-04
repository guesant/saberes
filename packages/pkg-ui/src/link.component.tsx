import { Link as MuiLink, type LinkProps as MuiLinkProps } from "@mui/material";
import type { ReactElement } from "react";

export type UILinkProps = MuiLinkProps;

export function UILink(props: UILinkProps): ReactElement {
  return <MuiLink {...props} />;
}
