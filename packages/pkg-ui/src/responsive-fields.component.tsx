import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIResponsiveFieldsProps = {
  children: ReactNode;
  distribution?: "equal" | "intrinsic";
};

export function UIResponsiveFields(props: UIResponsiveFieldsProps): ReactElement {
  const distribution = props.distribution ?? "intrinsic";

  return (
    <UIBox
      gap="sm"
      inset="none"
      layout="row"
      sx={{
        "& > *": distribution === "equal" ? { flex: "1 1 0", minWidth: 0 } : { minWidth: 0 },
        flexDirection: { md: "row", xs: "column" },
        maxWidth: "100%",
        width: "100%",
      }}
    >
      {props.children}
    </UIBox>
  );
}
