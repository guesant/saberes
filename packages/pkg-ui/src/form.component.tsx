import { Box as MuiBox } from "@mui/material";
import type { UIFormProps } from "./form-props.interface";
import type { ReactElement } from "react";

export function UIForm(props: UIFormProps): ReactElement {
  return (
    <MuiBox
      alignItems="flex-start"
      component="form"
      data-ui-align="start"
      data-ui-gap="md"
      data-ui-layout="stack"
      display="flex"
      flexDirection="column"
      gap={2}
      onSubmit={props.onSubmit}
      width="100%"
    >
      {props.children}
    </MuiBox>
  );
}
