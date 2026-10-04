import { UIButton } from "@guesant/saberes-ui";
import { Link } from "react-router-dom";

export type NavigationButtonProps = {
  label: string;
  to: string;
};

export function NavigationButton(props: NavigationButtonProps) {
  return (
    <UIButton component={Link} color="inherit" to={props.to}>
      {props.label}
    </UIButton>
  );
}
