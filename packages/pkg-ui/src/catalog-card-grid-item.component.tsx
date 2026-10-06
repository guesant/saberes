import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UICatalogCardGridItemProps = {
  children: ReactNode;
};

export function UICatalogCardGridItem(props: UICatalogCardGridItemProps): ReactElement {
  return (
    <UIBox
      gap="none"
      inset="none"
      layout="column"
      sx={{ alignSelf: "stretch", height: "100%", minWidth: 0 }}
    >
      {props.children}
    </UIBox>
  );
}
