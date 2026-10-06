import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import type { UIBreadcrumbsProps } from "./breadcrumbs-props.interface";
import type { ReactElement } from "react";

export function UIBreadcrumbs(props: UIBreadcrumbsProps): ReactElement {
  return (
    <MuiBreadcrumbs aria-label={props.ariaLabel} separator="/">
      {props.children}
    </MuiBreadcrumbs>
  );
}
