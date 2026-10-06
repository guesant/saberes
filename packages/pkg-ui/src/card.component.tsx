import { Card as MuiCard, type CardProps as MuiCardProps } from "@mui/material";
import { renderCardAction } from "./render-card-action.function";
import type { UICardActionProps } from "./card-action-props.interface";
import type { ReactElement } from "react";

export type UICardProps = MuiCardProps & UICardActionProps;

export function UICard(props: UICardProps): ReactElement {
  const { action, ...cardProps } = props;

  return renderCardAction(action, <MuiCard {...cardProps} />);
}
