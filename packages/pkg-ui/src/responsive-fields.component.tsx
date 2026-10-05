import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIResponsiveFieldsProps = {
  children: ReactNode;
  distribution?: "equal" | "intrinsic";
};

export function UIResponsiveFields(props: UIResponsiveFieldsProps): ReactElement {
  const distribution = props.distribution ?? "intrinsic";

  return (
    <MuiBox
      data-ui-gap="sm"
      data-ui-layout="stack"
      display="flex"
      flexDirection={{ md: "row", xs: "column" }}
      gap={1}
      minWidth={0}
      sx={{
        "& > *": distribution === "equal" ? { flex: "1 1 0", minWidth: 0 } : { minWidth: 0 },
        maxWidth: "100%",
        width: "100%",
      }}
    >
      {props.children}
    </MuiBox>
  );
}
