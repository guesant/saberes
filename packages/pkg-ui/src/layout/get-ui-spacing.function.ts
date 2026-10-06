import type { UiSpacingToken } from "./ui-spacing-token.type";

interface ResponsiveSectionSpacing {
  [breakpoint: string]: number;
  md: number;
  xs: number;
}

type SpacingValue = number | ResponsiveSectionSpacing;

const spacingByToken = {
  lg: 3,
  md: 2,
  none: 0,
  section: { md: 4, xs: 3 },
  sm: 1,
  xl: 4,
  xs: 0.5,
} satisfies Record<UiSpacingToken, SpacingValue>;

export function getUiSpacing(token: UiSpacingToken): SpacingValue {
  return spacingByToken[token];
}
