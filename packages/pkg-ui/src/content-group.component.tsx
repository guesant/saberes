import { Stack as MuiStack } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIContentGroupProps = {
  children: ReactNode;
  variant?: "tight" | "content" | "section" | "list";
};

const groupSpacing = {
  content: 2,
  list: 0,
  section: 3,
  tight: 1,
};

export function UIContentGroup(props: UIContentGroupProps): ReactElement {
  return <MuiStack spacing={groupSpacing[props.variant || "content"]}>{props.children}</MuiStack>;
}
