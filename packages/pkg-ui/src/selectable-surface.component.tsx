import { UIInteractiveSelectableSurface } from "./interactive-selectable-surface.component";
import { UIStaticSelectableSurface } from "./static-selectable-surface.component";
import type { UISelectableSurfaceProps } from "./ui-selectable-surface-props.interface";
import type { ReactElement } from "react";

export function UISelectableSurface(props: UISelectableSurfaceProps): ReactElement {
  if (props.interactive) {
    return <UIInteractiveSelectableSurface {...props} interactive />;
  }

  return <UIStaticSelectableSurface {...props} />;
}
