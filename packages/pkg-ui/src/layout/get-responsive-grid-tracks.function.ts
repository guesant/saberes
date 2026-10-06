import type { UIGridProps } from "./ui-grid-props.interface";

export interface ResponsiveGridTracks {
  [breakpoint: string]: string;
  md: string;
  sm: string;
  xs: string;
}

const minimumWidths = { compact: "12rem", comfortable: "18rem" } as const;

export function getResponsiveGridTracks(
  columns: UIGridProps["columns"],
  minItemWidth: UIGridProps["minItemWidth"],
): string | ResponsiveGridTracks {
  const minWidth = minItemWidth ? minimumWidths[minItemWidth] : minimumWidths.comfortable;

  if (columns === undefined) {
    return `repeat(auto-fit, minmax(min(100%, ${minWidth}), 1fr))`;
  }

  return { md: `repeat(${columns}, minmax(0, 1fr))`, sm: "repeat(2, minmax(0, 1fr))", xs: "minmax(0, 1fr)" };
}
