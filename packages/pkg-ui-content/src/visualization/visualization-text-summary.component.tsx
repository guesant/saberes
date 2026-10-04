import { UIContentSurface, UIContentText } from "@guesant/saberes-ui";
import type { UIVisualizationTextSummaryProps } from "./visualization-text-summary-props.interface";
import type { ReactElement } from "react";

export function UIVisualizationTextSummary(props: UIVisualizationTextSummaryProps): ReactElement {
  return (
    <UIContentSurface ariaLabel={props.title} component="section" mode="text-summary">
      <UIContentText component="h3" variant="heading">
        {props.title}
      </UIContentText>
      <UIContentText component="pre" preserveWhitespace variant="body">
        {props.summary}
      </UIContentText>
    </UIContentSurface>
  );
}
