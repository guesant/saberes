import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UITwoColumnLayoutProps = {
  primary: ReactNode;
  secondary: ReactNode;
};

export function UITwoColumnLayout(props: UITwoColumnLayoutProps): ReactElement {
  return (
    <UIBox
      gap="lg"
      inset="none"
      layout="grid"
      sx={{ gridTemplateColumns: { md: "minmax(0, 2fr) minmax(0, 1fr)", xs: "minmax(0, 1fr)" } }}
    >
      {props.primary}
      {props.secondary}
    </UIBox>
  );
}
