import { Card as MuiCard } from "@mui/material";
import { UIBox } from "./box.component";
import type { CardProps as MuiCardProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIFullHeightCardProps = Omit<MuiCardProps, "sx">;

export function UIFullHeightCard(props: UIFullHeightCardProps): ReactElement {
  return <UIBox {...props} component={MuiCard} gap="md" inset="none" layout="column" sx={{ height: "100%" }} />;
}
