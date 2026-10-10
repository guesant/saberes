import { TextField } from "@mui/material";
import { UISelectFieldOptionItem } from "./select-field-option-item.component";
import type { UiSelectFieldProps } from "./ui-select-field-props.interface";
import type { ReactElement } from "react";

export function UISelectField(props: UiSelectFieldProps): ReactElement {
  return (
    <TextField
      fullWidth
      label={props.label}
      onChange={(event) => { props.onChange(event.target.value); }}
      select
      value={props.value}
    >
      {props.options.map((option) => {return (
        <UISelectFieldOptionItem key={option.value} label={option.label} value={option.value} />
      );})}
    </TextField>
  );
}
