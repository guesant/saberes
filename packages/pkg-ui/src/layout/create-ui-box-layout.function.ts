import { getUiBoxGridTracks } from "./get-ui-box-grid-tracks.function";
import { getUiSpacing } from "./get-ui-spacing.function";
import type { UiBoxLayoutConfig } from "./ui-box-layout-config.interface";
import type { UIBoxProps } from "./ui-box-props.type";
import type { ElementType } from "react";

const layoutConfigurations = {
  column: {
    false: { alignContent: "start", childStyle: undefined, closure: undefined, display: "grid", direction: undefined, gap: "md", gridAutoRows: "max-content", inset: "sm", layout: "stack", wrap: "nowrap" },
    true: { alignContent: "start", childStyle: undefined, closure: undefined, display: "grid", direction: undefined, gap: "md", gridAutoRows: "max-content", inset: "sm", layout: "stack", wrap: "nowrap" },
  },
  flow: {
    false: { alignContent: undefined, childStyle: undefined, closure: undefined, display: "block", direction: undefined, gap: "none", gridAutoRows: undefined, inset: "none", layout: "flow", wrap: "nowrap" },
    true: { alignContent: undefined, childStyle: undefined, closure: undefined, display: "block", direction: undefined, gap: "none", gridAutoRows: undefined, inset: "none", layout: "flow", wrap: "nowrap" },
  },
  grid: {
    false: { alignContent: undefined, childStyle: { "& > *": { maxWidth: "100%", minWidth: 0, overflowWrap: "anywhere" } }, closure: "closed", display: "grid", direction: undefined, gap: "md", gridAutoRows: undefined, inset: "sm", layout: "equal-grid", wrap: "nowrap" },
    true: { alignContent: undefined, childStyle: { "& > *": { maxWidth: "100%", minWidth: 0, overflowWrap: "anywhere" } }, closure: "closed", display: "grid", direction: undefined, gap: "md", gridAutoRows: undefined, inset: "sm", layout: "equal-grid", wrap: "nowrap" },
  },
  native: {
    false: { alignContent: "start", childStyle: undefined, closure: undefined, display: undefined, direction: undefined, gap: "none", gridAutoRows: "max-content", inset: "none", layout: "native", wrap: "nowrap" },
    true: { alignContent: "start", childStyle: undefined, closure: undefined, display: undefined, direction: undefined, gap: "none", gridAutoRows: "max-content", inset: "none", layout: "native", wrap: "nowrap" },
  },
  row: {
    false: { alignContent: undefined, childStyle: undefined, closure: undefined, display: "flex", direction: "row", gap: "md", gridAutoRows: undefined, inset: "sm", layout: "row", wrap: "nowrap" },
    true: { alignContent: undefined, childStyle: undefined, closure: undefined, display: "flex", direction: "row", gap: "sm", gridAutoRows: undefined, inset: "none", layout: "cluster", wrap: "wrap" },
  },
} as const;

const alignmentValues = { center: "center", end: "flex-end", start: "flex-start", stretch: "stretch" } as const;

export function createUiBoxLayout<Component extends ElementType>(props: UIBoxProps<Component>): UiBoxLayoutConfig {
  const layout = props.layout ?? "column";

  const nativeLayout = layout === "native";

  const wrapping = String(props.wrap ?? false) as "false" | "true";

  const alignment = props.align ?? "stretch";

  const configuration = layoutConfigurations[layout][wrapping];

  const { gap: gapToken, inset: insetToken } = { gap: configuration.gap, inset: configuration.inset, ...props };

  const tracks = getUiBoxGridTracks(layout, props.columns, props.minItemWidth);

  const sizingStyles: UiBoxLayoutConfig["sx"] = nativeLayout ? {} : { boxSizing: "border-box", maxWidth: "100%", width: "100%" };

  const structuralStyles = Object.fromEntries(
    Object.entries({ alignContent: configuration.alignContent, gridAutoRows: configuration.gridAutoRows })
      .filter(([, value]) => { return value !== undefined; }),
  ) as UiBoxLayoutConfig["sx"];

  return {
    alignItems: alignmentValues[alignment],
    component: props.component,
    dataAlign: alignment,
    dataClosure: configuration.closure,
    dataGap: gapToken,
    display: configuration.display,
    flexDirection: configuration.direction,
    flexWrap: configuration.wrap,
    gap: getUiSpacing(gapToken),
    gridTracks: tracks,
    inset: insetToken,
    layoutName: configuration.layout,
    sx: {
      ...configuration.childStyle,
      ...structuralStyles,
      gridTemplateColumns: tracks,
      ...sizingStyles,
      padding: getUiSpacing(insetToken),
    },
  };
}
