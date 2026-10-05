import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Box as MuiBox,
  Typography as MuiTypography,
} from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIQuickAccessCardProps = {
  children: ReactNode;
  description: string;
  icon: ReactNode;
  title: string;
};

export function UIQuickAccessCard(props: UIQuickAccessCardProps): ReactElement {
  return (
    <MuiCard
      data-ui-layout="stack"
      sx={{
        height: "100%",
        minHeight: 144,
      }}
    >
      <MuiCardContent data-ui-layout="stack" sx={{ height: "100%" }}>
        <MuiBox
          alignItems="flex-start"
          data-ui-align="start"
          data-ui-gap="sm"
          data-ui-layout="stack"
          display="flex"
          flexDirection="column"
          gap={1}
          sx={{ height: "100%" }}
        >
          {props.icon}
          <MuiTypography component="strong" variant="subtitle1">
            {props.title}
          </MuiTypography>
          <MuiTypography color="text.secondary" variant="body2">
            {props.description}
          </MuiTypography>
          {props.children}
        </MuiBox>
      </MuiCardContent>
    </MuiCard>
  );
}
