import { UIBox } from "./box.component";
import { UICircularProgress } from "./circular-progress.component";
import { UITypography } from "./typography.component";
import type { ReactElement } from "react";

export interface UIStartupScreenProps {
  brand: string;
  message: string;
}

export function UIStartupScreen(props: UIStartupScreenProps): ReactElement {
  return (
    <UIBox
      align="center"
      component="main"
      gap="md"
      id="app-startup"
      inset="lg"
      layout="column"
      role="status"
      sx={{
        alignContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        justifyContent: "center",
        minHeight: "100vh",
        "@supports (height: 100dvh)": { minHeight: "100dvh" },
        textAlign: "center",
      }}
      aria-busy="true"
      aria-live="polite"
    >
      <UICircularProgress aria-label={props.message} size={28} />
      <UITypography variant="h6">{props.brand}</UITypography>
      <UITypography color="text.secondary" variant="body2">
        {props.message}
      </UITypography>
    </UIBox>
  );
}
