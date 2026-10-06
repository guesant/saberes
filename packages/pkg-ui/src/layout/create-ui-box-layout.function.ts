import { getResponsiveGridTracks } from "./get-responsive-grid-tracks.function";
import { getUiSpacing } from "./get-ui-spacing.function";
import type { UiBoxLayoutConfig } from "./ui-box-layout-config.interface";
import type { UIBoxProps } from "./ui-box-props.type";
import type { ElementType } from "react";

const layoutConfigurations = {
  column: {
    false: { childStyle: undefined, closure: undefined, display: "flex", direction: "column", gap: "md", inset: "sm", layout: "stack", wrap: "nowrap" },
    true: { childStyle: undefined, closure: undefined, display: "flex", direction: "column", gap: "md", inset: "sm", layout: "stack", wrap: "nowrap" },
  },
  flow: {
    false: { childStyle: undefined, closure: undefined, display: "block", direction: undefined, gap: "none", inset: "none", layout: "flow", wrap: "nowrap" },
    true: { childStyle: undefined, closure: undefined, display: "block", direction: undefined, gap: "none", inset: "none", layout: "flow", wrap: "nowrap" },
  },
  grid: {
    false: { childStyle: { "& > *": { maxWidth: "100%", minWidth: 0, overflowWrap: "anywhere" } }, closure: "closed", display: "grid", direction: undefined, gap: "md", inset: "sm", layout: "equal-grid", wrap: "nowrap" },
    true: { childStyle: { "& > *": { maxWidth: "100%", minWidth: 0, overflowWrap: "anywhere" } }, closure: "closed", display: "grid", direction: undefined, gap: "md", inset: "sm", layout: "equal-grid", wrap: "nowrap" },
  },
  row: {
    false: { childStyle: undefined, closure: undefined, display: "flex", direction: "row", gap: "md", inset: "sm", layout: "row", wrap: "nowrap" },
    true: { childStyle: undefined, closure: undefined, display: "flex", direction: "row", gap: "sm", inset: "none", layout: "cluster", wrap: "wrap" },
  },
} as const;

const alignmentValues = { center: "center", end: "flex-end", start: "flex-start", stretch: "stretch" } as const;

export function createUiBoxLayout<Component extends ElementType>(props: UIBoxProps<Component>): UiBoxLayoutConfig {
  const layout = props.layout ?? "column";

  const wrapping = String(props.wrap ?? false) as "false" | "true";

  const alignment = props.align ?? "stretch";

  const configuration = layoutConfigurations[layout][wrapping];

  const { gap: gapToken, inset: insetToken } = { gap: configuration.gap, inset: configuration.inset, ...props };

  const tracks = getResponsiveGridTracks(props.columns, props.minItemWidth);

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
      boxSizing: "border-box",
      gridTemplateColumns: tracks,
      maxWidth: "100%",
      padding: getUiSpacing(insetToken),
      width: "100%",
    },
  };
}
