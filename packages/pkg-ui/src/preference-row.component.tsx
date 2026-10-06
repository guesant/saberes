import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export interface UIPreferenceRowProps {
  children: ReactNode;
  control: ReactNode;
}

export function UIPreferenceRow(props: UIPreferenceRowProps): ReactElement {
  return (
    <UIBox
      align="center"
      gap="md"
      inset="none"
      layout="grid"
      sx={{
        gridTemplateColumns: { sm: "minmax(0, 1fr) auto", xs: "1fr" },
        borderBottom: "1px solid",
        borderColor: "divider",
        minHeight: 72,
        py: 2,
        width: "100%",
      }}
    >
      {props.children}
      {props.control}
    </UIBox>
  );
}
