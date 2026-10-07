import { UIBox } from "./box.component";
import { UIEqualActionsGrid } from "./equal-actions-grid.component";
import { UIStackedActions } from "./stacked-actions.component";
import type { ReactElement, ReactNode } from "react";

export type UIInlineActionsProps = {
  children: ReactNode;
  equal?: boolean;
  justify?: "start" | "end" | "between";
  stacked?: boolean;
  wrap?: boolean;
};

const justifyContentByAlignment = {
  between: "space-between",
  end: "flex-end",
  start: "flex-start",
} as const;

export function UIInlineActions(props: UIInlineActionsProps): ReactElement {
  if (props.equal) {
    return <UIEqualActionsGrid content={props.children} />;
  }

  if (props.stacked) {
    return <UIStackedActions content={props.children} />;
  }

  return (
    <UIBox
      align="center"
      gap="sm"
      inset="none"
      layout="row"
      sx={{
        justifyContent: justifyContentByAlignment[props.justify ?? "start"],
        maxWidth: "100%",
        width: "100%",
      }}
      wrap={props.wrap}
    >
      {props.children}
    </UIBox>
  );
}
