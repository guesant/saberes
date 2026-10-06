import { Box as MuiBox } from "@mui/material";
import { createUiBoxLayout } from "./layout/create-ui-box-layout.function";
import { getUiBoxNativeProps } from "./layout/get-ui-box-native-props.function";
import type { UIBoxProps } from "./layout/ui-box-props.type";
import type { ReactElement, ElementType } from "react";

export function UIBox<Component extends ElementType = "div">(props: UIBoxProps<Component>): ReactElement {
  const elementProps = getUiBoxNativeProps(props);

  const geometry = createUiBoxLayout(props);

  return (
    <MuiBox
      {...elementProps}
      alignItems={geometry.alignItems}
      component={geometry.component}
      data-ui-align={geometry.dataAlign}
      data-ui-closure={geometry.dataClosure}
      data-ui-gap={geometry.dataGap}
      data-ui-inset={geometry.inset}
      data-ui-layout={geometry.layoutName}
      display={geometry.display}
      flexDirection={geometry.flexDirection}
      flexWrap={geometry.flexWrap}
      gap={geometry.gap}
      minWidth={0}
      sx={geometry.sx}
    >
      {props.children}
    </MuiBox>
  );
}
