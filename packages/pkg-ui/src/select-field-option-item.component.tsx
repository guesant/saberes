import { MenuItem } from "@mui/material";
import type { UISelectFieldOptionItemProps } from "./ui-select-field-option-item-props.interface";
import type { ReactElement } from "react";

export function UISelectFieldOptionItem(props: UISelectFieldOptionItemProps): ReactElement {
  return <MenuItem value={props.value}>{props.label}</MenuItem>;
}
