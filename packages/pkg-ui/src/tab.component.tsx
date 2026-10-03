import { Tab as MuiTab, type TabProps as MuiTabProps } from "@mui/material";
import type { ReactElement } from "react";

export type TabProps = MuiTabProps;

export function Tab(props: TabProps): ReactElement {
  return <MuiTab {...props} />;
}
