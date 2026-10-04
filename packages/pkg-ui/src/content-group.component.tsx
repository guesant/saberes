import { Stack as MuiStack } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIContentGroupProps = {
  children: ReactNode;
  variant?: "tight" | "content" | "section" | "list" | "inline";
};

const groupSpacing = {
  content: 2,
  list: 0,
  section: 3,
  tight: 1,
  inline: 1,
};

export function UIContentGroup(props: UIContentGroupProps): ReactElement {
  const variant = props.variant || "content";

  let direction: "column" | "row" = "column";

  const dataGap = {
    content: "md",
    inline: "sm",
    list: "md",
    section: "md",
    tight: "xs",
  }[variant];

  if (variant === "inline") {
    direction = "row";
  }

  return (
    <MuiStack
      data-ui-gap={dataGap}
      data-ui-layout={variant === "inline" ? "row" : "stack"}
      direction={direction}
      flexWrap="wrap"
      minWidth={0}
      spacing={groupSpacing[variant]}
      sx={{
        "& > *": { maxWidth: "100%", minWidth: 0 },
        maxWidth: "100%",
        width: "100%",
      }}
    >
      {props.children}
    </MuiStack>
  );
}
