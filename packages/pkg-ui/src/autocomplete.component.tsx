import { Autocomplete as MuiAutocomplete, TextField as MuiTextField } from "@mui/material";
import type { UIAutocompleteProps } from "./autocomplete-props.interface";
import type { ReactElement } from "react";

export function UIAutocomplete(props: UIAutocompleteProps): ReactElement {
  const selected = props.options.find((option) => { return option.value === props.value; }) ?? null;

  return (
    <MuiAutocomplete
      autoHighlight
      clearOnEscape
      disabled={props.disabled}
      getOptionLabel={(option) => { return option.label; }}
      loading={props.loading}
      onChange={(_, option) => { props.onChange(option?.value ?? ""); }}
      options={props.options}
      renderInput={(inputProps) => {
        return <MuiTextField {...inputProps} label={props.label} />;
      }}
      value={selected}
    />
  );
}
