import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Typography as MuiTypography,
} from "@mui/material";
import { UIBox } from "./box.component";
import { renderCardAction } from "./render-card-action.function";
import type { CardActionElement } from "./card-action-element.type";
import type { ReactElement, ReactNode } from "react";

export type UIQuickAccessCardProps = {
  actionLabel: string;
  action: CardActionElement;
  description: string;
  icon: ReactNode;
  title: string;
};

export function UIQuickAccessCard(props: UIQuickAccessCardProps): ReactElement {
  const card = (
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
        <MuiTypography color="primary" variant="button">
          {props.actionLabel} →
        </MuiTypography>
      </UIBox>
    </MuiCard>
  );

  return renderCardAction(props.action, card);
}
