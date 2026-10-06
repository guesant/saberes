import { Tabs as MuiTabs, type TabsProps as MuiTabsProps } from "@mui/material";
import type { ReactElement } from "react";

export type UITabsProps = Omit<
  MuiTabsProps,
  "allowScrollButtonsMobile" | "scrollButtons" | "variant"
>;

export function UITabs(props: UITabsProps): ReactElement {
  return (
    <MuiTabs
      {...props}
      allowScrollButtonsMobile
      scrollButtons="auto"
      variant="scrollable"
    />
  );
}
