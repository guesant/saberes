import { List as MuiList, type ListProps as MuiListProps } from "@mui/material";
import { UIBox } from "./box.component";
import type { UiSpacingToken } from "./layout/ui-spacing-token.type";
import type { ReactElement } from "react";

export interface UIListProps extends Omit<MuiListProps, "sx"> {
  inset?: UiSpacingToken;
}

export function UIList(props: UIListProps): ReactElement {
  const { inset = "none", ...listProps } = props;

  return <UIBox {...listProps} component={MuiList} inset={inset} layout="column" />;
}
