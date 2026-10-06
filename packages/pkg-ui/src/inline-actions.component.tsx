import { UIBox } from "./box.component";
import { UIEqualActionsGrid } from "./equal-actions-grid.component";
import type { ReactElement, ReactNode } from "react";

export type UIInlineActionsProps = {
  children: ReactNode;
  equal?: boolean;
  justify?: "start" | "end" | "between";
  wrap?: boolean;
};

export function UIInlineActions(props: UIInlineActionsProps): ReactElement {
  if (props.equal) {
    return <UIEqualActionsGrid content={props.children} />;
  }

  return (
    <UIBox
      align="center"
      gap="sm"
      inset="none"
      layout="row"
      sx={{
        justifyContent:
          props.justify === "end"
            ? "flex-end"
            : props.justify === "between"
              ? "space-between"
              : "flex-start",
        maxWidth: "100%",
        width: "100%",
      }}
      wrap={props.wrap}
    >
      {props.children}
    </UIBox>
  );
}
