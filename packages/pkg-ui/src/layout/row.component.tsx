import { UIBox } from "../box.component";
import { createUiRowLayout } from "./create-ui-row-layout.function";
import type { UIRowProps } from "./ui-row-props.interface";
import type { ReactElement } from "react";

export function UIRow(props: UIRowProps): ReactElement {
  const layout = createUiRowLayout(props);

  return (
    <UIBox
      align={layout.align}
      component={layout.component}
      data-ui-align={layout.align}
      data-ui-gap={layout.gap}
      data-ui-inset={layout.inset}
      data-ui-layout={layout.layout}
      gap={layout.gap}
      inset={layout.inset}
      layout="row"
      wrap={layout.wrap}
    >
      {layout.children}
    </UIBox>
  );
}
