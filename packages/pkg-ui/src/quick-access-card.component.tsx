import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Typography as MuiTypography,
} from "@mui/material";
import { UIBox } from "./box.component";
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
      <UIBox
        align="start"
        component={MuiCardContent}
        gap="sm"
        inset="md"
        layout="column"
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
      </UIBox>
    </MuiCard>
  );
}
