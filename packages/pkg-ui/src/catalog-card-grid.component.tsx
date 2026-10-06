import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UICatalogCardGridProps = {
  children: ReactNode;
};

export function UICatalogCardGrid(props: UICatalogCardGridProps): ReactElement {
  return (
    <UIBox
      gap="md"
      inset="none"
      layout="grid"
      sx={{
        alignItems: "stretch",
        gridAutoRows: "minmax(0, 1fr)",
        gridTemplateColumns: {
          md: "repeat(2, minmax(0, 1fr))",
          xs: "minmax(0, 1fr)",
        },
      }}
    >
      {props.children}
    </UIBox>
  );
}
