import { ShellBreadcrumbCurrent } from "./shell-breadcrumb-current.component";
import { ShellBreadcrumbLink } from "./shell-breadcrumb-link.component";
import type { ShellBreadcrumbCrumbProps } from "./shell-breadcrumb-crumb-props.interface";

export function ShellBreadcrumbCrumb(props: ShellBreadcrumbCrumbProps) {
  if (props.item.to && !props.current) {
    return <ShellBreadcrumbLink label={props.item.label} to={props.item.to} />;
  }

  return <ShellBreadcrumbCurrent label={props.item.label} />;
}
