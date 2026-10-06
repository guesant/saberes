import type { UIGridProps } from "./ui-grid-props.interface";

export interface ResponsiveGridTracks {
  [breakpoint: string]: string;
  md: string;
  sm: string;
  xs: string;
}

const mediumMinimumColumns = { compact: 2, comfortable: 1 } as const;

export function getResponsiveGridTracks(
  columns: UIGridProps["columns"],
  minItemWidth: UIGridProps["minItemWidth"],
): string | ResponsiveGridTracks {
  const maxColumns = Math.min(columns ?? 2, 2);

  const mediumColumns = Math.min(maxColumns, mediumMinimumColumns[minItemWidth ?? "comfortable"]);

  return {
    md: `repeat(${maxColumns}, minmax(0, 1fr))`,
    sm: `repeat(${mediumColumns}, minmax(0, 1fr))`,
    xs: "minmax(0, 1fr)",
  };
}
