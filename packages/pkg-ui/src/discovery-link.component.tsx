import { Box as MuiBox, Typography as MuiTypography } from "@mui/material";
import type { ReactElement } from "react";

export interface UIDiscoveryLinkProps {
  title: string;
  description: string;
  href: string;
}

export function UIDiscoveryLink(props: UIDiscoveryLinkProps): ReactElement {
  return (
    <MuiBox
      component="a"
      href={props.href}
      data-ui-gap="sm"
      data-ui-inset="md"
      data-ui-layout="stack"
      sx={{
        "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 3 },
        "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
        bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "0.25rem",
        color: "text.primary", display: "flex", flexDirection: "column", gap: 1, minWidth: 0, p: 2, textDecoration: "none",
      }}
    >
      <MuiTypography component="strong" variant="h6">{props.title}</MuiTypography>
      <MuiTypography color="text.secondary" variant="body2">{props.description}</MuiTypography>
    </MuiBox>
  );
}
