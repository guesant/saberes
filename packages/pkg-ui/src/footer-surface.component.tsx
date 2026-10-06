import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIFooterSurfaceProps = {
  children: ReactNode;
};

export function UIFooterSurface(props: UIFooterSurfaceProps): ReactElement {
  return (
    <UIBox component="footer" gap="md" inset="xl" sx={{ color: "text.secondary", textAlign: "center" }}>
      {props.children}
    </UIBox>
  );
}
