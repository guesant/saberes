import {
  ListItemButton as MuiListItemButton,
  ListItemText as MuiListItemText,
} from "@mui/material";
import type { UICommandPaletteItemProps } from "./command-palette-item-props.interface";
import type { ReactElement } from "react";

export function UICommandPaletteItem(props: UICommandPaletteItemProps): ReactElement {
  return (
    <MuiListItemButton
      onClick={() => {
        return props.onSelect(props.item);
      }}
    >
      <MuiListItemText primary={props.item.label} secondary={props.item.description} />
    </MuiListItemButton>
  );
}
