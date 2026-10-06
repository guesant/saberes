import { UILink } from "@guesant/saberes-ui";
import { useNavigate } from "react-router-dom";
import { isModifiedClick } from "./is-modified-click.function";
import type { ShellBreadcrumbLinkProps } from "./shell-breadcrumb-link-props.interface";

export function ShellBreadcrumbLink(props: ShellBreadcrumbLinkProps) {
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    if (isModifiedClick(event)) {
      return;
    }

    event.preventDefault();

    navigate(props.to);
  };

  return (
    <UILink href={props.to} onClick={handleClick} underline="hover" color="inherit">
      {props.label}
    </UILink>
  );
}
