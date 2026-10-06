import { Card as MuiCard } from "@mui/material";
import { UIBox } from "./box.component";
import { renderCardAction } from "./render-card-action.function";
import type { UICardActionProps } from "./card-action-props.interface";
import type { CardProps as MuiCardProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIFullHeightCardProps = Omit<MuiCardProps, "sx"> & UICardActionProps;

export function UIFullHeightCard(props: UIFullHeightCardProps): ReactElement {
  const { action, ...cardProps } = props;

  return renderCardAction(
    action,
    <UIBox {...cardProps} component={MuiCard} gap="md" inset="none" layout="column" sx={{ height: "100%" }} />,
  );
}
