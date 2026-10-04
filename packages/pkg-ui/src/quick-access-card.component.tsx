import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Stack as MuiStack,
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
      sx={{
        height: "100%",
        minHeight: 144,
      }}
    >
      <MuiCardContent sx={{ height: "100%" }}>
        <MuiStack
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1.5}
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
        </MuiStack>
      </MuiCardContent>
    </MuiCard>
  );
}
