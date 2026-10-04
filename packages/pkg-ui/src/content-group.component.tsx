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

  return (
    <MuiStack
      direction={variant === "inline" ? "row" : "column"}
      flexWrap="wrap"
      spacing={groupSpacing[variant]}
    >
      {props.children}
    </MuiStack>
  );
}
