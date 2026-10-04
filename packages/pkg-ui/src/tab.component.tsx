import { Tab as MuiTab, type TabProps as MuiTabProps } from "@mui/material";
import type { ReactElement } from "react";

export type UITabProps = MuiTabProps;

export function UITab(props: UITabProps): ReactElement {
  return <MuiTab {...props} />;
}
