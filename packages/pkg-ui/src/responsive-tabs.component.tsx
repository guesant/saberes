import {
  Tabs as MuiTabs,
  type SxProps,
  type TabsProps as MuiTabsProps,
  type Theme,
} from "@mui/material";
import type { ReactElement } from "react";

export interface UIResponsiveTabsProps extends Omit<MuiTabsProps, "sx"> {}

const responsiveTabsSx: SxProps<Theme> = {
  "& .MuiTab-root": {
    flex: { sm: "1 1 0", xs: "1 0 50%" },
    maxWidth: { sm: "none", xs: "50%" },
    minWidth: { sm: 0, xs: "50%" },
  },
  "& .MuiTabs-flexContainer": {
    flexWrap: { sm: "nowrap", xs: "wrap" },
  },
};

export function UIResponsiveTabs(props: UIResponsiveTabsProps): ReactElement {
  return <MuiTabs {...props} sx={responsiveTabsSx} variant="fullWidth" />;
}
