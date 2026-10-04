import { Tabs as MuiTabs, type TabsProps as MuiTabsProps } from "@mui/material";
import type { ReactElement } from "react";

export type UITabsProps = MuiTabsProps;

export function UITabs(props: UITabsProps): ReactElement {
  return <MuiTabs {...props} />;
}
