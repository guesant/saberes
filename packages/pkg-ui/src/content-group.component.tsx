import { Box as MuiBox } from "@mui/material";
import type { ContentGroupGap } from "./content-group-gap.type";
import type { ReactElement, ReactNode } from "react";

export type UIContentGroupProps = {
  children: ReactNode;
  id?: string;
  variant?: "tight" | "content" | "section" | "list" | "inline";
};

const groupLayout = {
  content: { alignItems: undefined, dataGap: "md", direction: "column", flexWrap: undefined, gap: 2, layout: "stack" },
  inline: { alignItems: "center", dataGap: "sm", direction: "row", flexWrap: "wrap", gap: 1, layout: "cluster" },
  list: { alignItems: undefined, dataGap: "sm", direction: "column", flexWrap: undefined, gap: 1, layout: "stack" },
  section: { alignItems: undefined, dataGap: "section", direction: "column", flexWrap: undefined, gap: { md: 4, xs: 3 }, layout: "stack" },
  tight: { alignItems: undefined, dataGap: "xs", direction: "column", flexWrap: undefined, gap: 0.5, layout: "stack" },
} satisfies Record<
  NonNullable<UIContentGroupProps["variant"]>,
  {
    alignItems: "center" | undefined;
    dataGap: "section" | "xs" | "sm" | "md";
    direction: "column" | "row";
    flexWrap: "wrap" | undefined;
    gap: ContentGroupGap;
    layout: "cluster" | "stack";
  }
>;

export function UIContentGroup(props: UIContentGroupProps): ReactElement {
  const variant = props.variant || "content";

  const layout = groupLayout[variant];

  return (
    <MuiBox
      alignItems={layout.alignItems}
      data-ui-align={layout.alignItems ? "center" : undefined}
      data-ui-gap={layout.dataGap}
      data-ui-layout={layout.layout}
      display="flex"
      flexDirection={layout.direction}
      flexWrap={layout.flexWrap}
      id={props.id}
      minWidth={0}
      sx={{
        "& > *": { maxWidth: "100%", minWidth: 0 },
        gap: layout.gap,
        maxWidth: "100%",
        width: "100%",
      }}
    >
      {props.children}
    </MuiBox>
  );
}
