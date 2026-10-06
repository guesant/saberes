import { getResponsiveGridTracks } from "./get-responsive-grid-tracks.function";
import type { UiBoxLayout } from "./ui-box-layout.type";
import type { UIBoxProps } from "./ui-box-props.type";

export function getUiBoxGridTracks(
  layout: UiBoxLayout,
  columns: UIBoxProps["columns"],
  minItemWidth: UIBoxProps["minItemWidth"],
): string | ReturnType<typeof getResponsiveGridTracks> {
  if (layout === "grid") {
    return getResponsiveGridTracks(columns, minItemWidth);
  }

  return "minmax(0, 1fr)";
}
