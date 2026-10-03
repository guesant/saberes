import { Tabs as MuiTabs, type TabsProps as MuiTabsProps } from "@mui/material";
import type { ReactElement } from "react";

export type TabsProps = MuiTabsProps;

export function Tabs(props: TabsProps): ReactElement {
  return <MuiTabs {...props} />;
}
