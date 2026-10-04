import { UIPaper, UITypography } from "@guesant/saberes-ui";
import type { UIVisualizationTextSummaryProps } from "./visualization-text-summary-props.interface";
import type { ReactElement } from "react";

export function UIVisualizationTextSummary(props: UIVisualizationTextSummaryProps): ReactElement {
  return (
    <UIPaper aria-label={props.title} component="section" sx={{ mt: 2, p: 2 }} variant="outlined">
      <UITypography component="h3" variant="subtitle1">
        {props.title}
      </UITypography>
      <UITypography component="pre" sx={{ m: 0, whiteSpace: "pre-wrap" }} variant="body2">
        {props.summary}
      </UITypography>
    </UIPaper>
  );
}
