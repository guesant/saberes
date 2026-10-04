import { UIButton, UIQuickAccessCard, UIQuickAccessGridItem } from "@guesant/saberes-ui";
import { Link } from "react-router-dom";
import type { MyStudyQuickAccessCardProps } from "./my-study-quick-access-card-props.interface";

export function MyStudyQuickAccessCard(props: MyStudyQuickAccessCardProps) {
  return (
    <UIQuickAccessGridItem>
      <UIQuickAccessCard description={props.description} icon={props.icon} title={props.title}>
        <UIButton component={Link} size="small" to={props.to} variant="outlined">
          Abrir
        </UIButton>
      </UIQuickAccessCard>
    </UIQuickAccessGridItem>
  );
}
