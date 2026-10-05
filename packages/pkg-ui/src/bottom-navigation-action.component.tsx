import {
  BottomNavigationAction as MuiBottomNavigationAction,
  type BottomNavigationActionProps as MuiBottomNavigationActionProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type UIBottomNavigationActionProps = MuiBottomNavigationActionProps;

export function UIBottomNavigationAction(props: UIBottomNavigationActionProps): ReactElement {
  return (
    <MuiBottomNavigationAction
      {...props}
      data-ui-layout="row"
      data-ui-overflow="hidden"
      sx={{
        "& .MuiBottomNavigationAction-label": {
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        flex: "1 1 0",
        maxWidth: "none",
        minWidth: 0,
        overflow: "hidden",
        ...props.sx,
      }}
    />
  );
}
