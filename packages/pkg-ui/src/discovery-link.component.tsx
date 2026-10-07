import { Typography as MuiTypography } from "@mui/material";
import { UIBox } from "./box.component";
import { UIButtonActionIcon } from "./button-action-icon.component";
import type { UIButtonActionIconName } from "./get-button-action-icon-name.function";
import type { ReactElement } from "react";

export interface UIDiscoveryLinkProps {
  title: string;
  description: string;
  href: string;
  iconName: UIButtonActionIconName;
}

export function UIDiscoveryLink(props: UIDiscoveryLinkProps): ReactElement {
  return (
    <UIBox
      component="a"
      gap="sm"
      href={props.href}
      inset="md"
      layout="column"
      sx={{
        "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 3 },
        "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
        bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "0.25rem",
        color: "text.primary", minWidth: 0, textDecoration: "none",
      }}
    >
      <UIBox align="center" gap="sm" inset="none" layout="row">
        <UIButtonActionIcon name={props.iconName} aria-hidden="true" />
        <MuiTypography component="strong" variant="h6">{props.title}</MuiTypography>
      </UIBox>
      <MuiTypography color="text.secondary" variant="body2">{props.description}</MuiTypography>
    </UIBox>
  );
}
