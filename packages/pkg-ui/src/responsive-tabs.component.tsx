import {
  Tabs as MuiTabs,
  type SxProps,
  type TabsProps as MuiTabsProps,
  type Theme,
} from "@mui/material";
import type { ReactElement } from "react";

export interface UIResponsiveTabsProps extends Omit<
  MuiTabsProps,
  "allowScrollButtonsMobile" | "scrollButtons" | "sx" | "variant"
> {}

const responsiveTabsSx: SxProps<Theme> = {
  "& .MuiTab-root": {
    flex: "0 0 auto",
    maxWidth: "none",
    minWidth: "max-content",
    whiteSpace: "nowrap",
  },
  "& .MuiTabs-flexContainer": {
    flexWrap: "nowrap",
  },
};

export function UIResponsiveTabs(props: UIResponsiveTabsProps): ReactElement {
  return (
    <MuiTabs
      {...props}
      allowScrollButtonsMobile
      scrollButtons
      sx={responsiveTabsSx}
      variant="scrollable"
    />
  );
}
