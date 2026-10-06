import type { ResponsiveGridTracks } from "./get-responsive-grid-tracks.function";
import type { UiSpacingToken } from "./ui-spacing-token.type";
import type { UiSpacingValue } from "./ui-spacing-value.type";
import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";
import type { ElementType } from "react";

export interface UiBoxLayoutConfig {
  alignItems?: "center" | "flex-end" | "flex-start" | "stretch";
  component?: ElementType;
  display?: "block" | "flex" | "grid";
  flexDirection?: "column" | "row";
  flexWrap: "nowrap" | "wrap";
  gap?: UiSpacingValue;
  gridTracks?: string | ResponsiveGridTracks;
  inset: UiSpacingToken;
  sx: SystemStyleObject<Theme>;
}
