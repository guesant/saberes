import type { UiBoxCustomDataRestriction } from "./ui-box-custom-data-restriction.type";
import type { UiBoxOptions } from "./ui-box-options.interface";
import type { ComponentPropsWithRef, ElementType } from "react";

// Polymorphic component props necessarily combine the selected element's native API with UIBox options.

export type UIBoxProps<Component extends ElementType = "div"> =
  Omit<
    ComponentPropsWithRef<Component>,
    | "alignItems"
    | "children"
    | "className"
    | "component"
    | "display"
    | "flexDirection"
    | "flexWrap"
    | "gap"
    | "gridTemplateColumns"
    | "inset"
    | "sx"
    | "style"
  > &
  UiBoxOptions<Component> &
  UiBoxCustomDataRestriction;
