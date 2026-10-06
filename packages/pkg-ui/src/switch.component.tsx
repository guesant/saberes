import { Switch as MuiSwitch, type SwitchProps as MuiSwitchProps } from "@mui/material";
import type { ReactElement } from "react";

export type UISwitchProps = MuiSwitchProps;

export function UISwitch(props: UISwitchProps): ReactElement {
  const { inputProps, slotProps, ...switchProps } = props;

  return (
    <MuiSwitch
      {...switchProps}
      disableRipple
      slotProps={{
        ...slotProps,
        input: { ...slotProps?.input, ...inputProps },
      }}
    />
  );
}
